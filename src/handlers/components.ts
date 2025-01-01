import isEmptyObject from "@/helpers/isEmptyObject";
import { readdir } from "fs/promises";

const ComponentsType = ["selects", "buttons", "modals", "autocomplete"];

const components = async (client: ExtendedClient) => {
    try {
        const componentTypes = await readdir(`./src/components/`, {
            withFileTypes: true,
        });

        for (const typeDir of componentTypes) {
            if (!typeDir.isDirectory() || !ComponentsType.includes(typeDir.name)) {
                client.logger.error(
                    `Invalid folder name: ${typeDir.name}, it must be one of ${ComponentsType.join(", ")}`,
                );
                continue;
            }

            const files = await readdir(`./src/components/${typeDir.name}/`);
            const filteredFiles = files.filter(
                (f) => f.endsWith(".js") || f.endsWith(".ts"),
            );

            for (const file of filteredFiles) {
                try {
                    const module = (await import(`../components/${typeDir.name}/${file}`))
                        .default;

                    if (!module || isEmptyObject(module)) {
                        client.logger.warn(`Module not found or empty at: ${file}`);
                        continue;
                    }

                    if (module.options && module.options.ignore) {
                        client.logger.warn(`Ignoring component at: ${file}`);
                        continue;
                    }

                    client.collection.components[
                        typeDir.name as "selects" | "buttons" | "autocomplete" | "modals"
                    ].set(module?.customId || module?.commandName, module);
                } catch (err: any) {
                    client.logger.error(
                        `Error loading component from file ${file}: ${err.message}`,
                    );
                }
            }
        }
    } catch (err: any) {
        client.logger.error(`Failed to load components: ${err.message}`);
    }
};

export default components;
