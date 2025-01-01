import isEmptyObject from "@/helpers/isEmptyObject";
import { readdir } from "fs/promises"; // Sử dụng promises để tận dụng async/await
import type { Command } from "@/typings/command";

const commands = async (client: ExtendedClient) => {
    try {
        const categories = await readdir(`./src/commands`, { withFileTypes: true });

        for (const category of categories) {
            if (!category.isDirectory()) continue; // Bỏ qua nếu không phải là thư mục

            const files = await readdir(`./src/commands/${category.name}`);
            const filteredFiles = files.filter(
                (file: string) => file.endsWith(".js") || file.endsWith(".ts"),
            );

            for (const file of filteredFiles) {
                const module: Command = (
                    await import(`../commands/${category.name}/${file}`)
                ).default;

                if (!module || isEmptyObject(module)) {
                    client.logger.warn(`Module not found at: ${file}`);
                    continue;
                }

                if (module.options && module.options?.ignore) {
                    client.logger.warn(`Ignore command at: ${file}`);
                    continue;
                }

                client.collection.prefixcommands.set(module.name, module);

                if (module.options?.aliases) {
                    for (const alias of module.options.aliases) {
                        if (client.collection.aliases.has(alias)) {
                            client.logger.error(
                                `Duplicate alias ${alias} at command ${module.name}!`,
                            );
                            continue;
                        }
                        client.collection.aliases.set(alias, module.name);
                    }
                }
            }
        }
    } catch (err: any) {
        client.logger.error(`Failed to load commands: ${err.message}`);
    }
};

export default commands;
