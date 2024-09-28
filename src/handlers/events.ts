import isEmptyObject from "@/helpers/isEmptyObject";
import { readdirSync } from "fs";
import { type LavalinkManagerEvents, type NodeManagerEvents } from "lavalink-client";
import type { Event } from "typings/event";

export default async (client: ExtendedClient) => {
    for (const type of readdirSync("./src/events")) {
        for (const file of readdirSync(`./src/events/${type}`).filter(
            (f: string) => f.endsWith(".js") || f.endsWith(".ts")
        )) {
            const module: Event = (await import(`../events/${type}/${file}`)).default;

            if (!module || isEmptyObject(module)) {
                client.logger.warn(`Module not found at: ${file}`);
                continue;
            }

            if (module.options.ignore) {
                client.logger.info(`Ignore event at: ${file}`);
                continue;
            }

            const bindEvent = module.handler.bind(null, client);

            if (type === "player") {
                client.manager[module.options.once ? "once" : "on"](
                    module.name as keyof LavalinkManagerEvents,
                    bindEvent
                );
            } else if (type === "node") {
                client.manager.nodeManager[module.options.once ? "once" : "on"](
                    module.name as keyof NodeManagerEvents,
                    bindEvent
                );
            } else {
                client[module.options.once ? "once" : "on"](module.name, bindEvent);
            }
        }
    }
};
