import isEmptyObject from "@/helpers/isEmptyObject";
import { readdirSync } from "fs";


const ComponentsType = ["selects", "buttons", "modals", "autocomplete"];
const components = async (client: ExtendedClient) => {
    for (const type of readdirSync(`./src/components/`)) {
        for (const file of readdirSync(`./src/components/${type}/`).filter(
            (f) => f.endsWith(".js") || f.endsWith(".ts")
        )) {
            const module = (await import(`../components/${type}/${file}`)).default;

            if (!module || isEmptyObject(module)) {
                client.logger.warn(`Module not found at: ${file}`);
                continue;
            }

            if (!module.options && module.options.ignore) {
                client.logger.warn(`Ignore component at: ${file}`);
                continue;
            }

            if (!ComponentsType.includes(type)) {
                client.logger.error(`Invalid folder name, it must be ${ComponentsType.join("/")}`);
                continue;
            }

            client.collection.components[type as "selects" | "buttons" | "autocomplete" | "modals"].set(
                module?.customId || module?.commandName,
                module
            );
        }
    }
};

export default components;
