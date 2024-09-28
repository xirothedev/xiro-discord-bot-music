import isEmptyObject from "@/helpers/isEmptyObject";
import { readdirSync } from "fs";
import type { Command } from "typings/command";

const commands = async (client: ExtendedClient) => {
    for (const category of readdirSync(`./src/commands`)) {
        for (const file of readdirSync(`./src/commands/${category}`).filter(
            (f: string) => f.endsWith(".js") || f.endsWith(".ts")
        )) {
            const module: Command = (await import(`../commands/${category}/${file}`)).default;

            if (!module || isEmptyObject(module)) {
                client.logger.warn(`Module not found at: ${file}`);
                continue;
            }

            if (module.options && module.options?.ignore) {
                client.logger.warn(`Ignore command at: ${file}`);
                continue;
            }

            client.collection.prefixcommands.set(module.name, module);

            if (!module.options?.aliases) break;
            module.options.aliases.forEach((alias: string) => {
                if (client.collection.aliases.has(alias)) {
                    client.logger.error(`Duplicate alias ${alias} at command ${module.name}!`);
                    return;
                }
                client.collection.aliases.set(alias, module.name);
            });
        }
    }
};

export default commands;
