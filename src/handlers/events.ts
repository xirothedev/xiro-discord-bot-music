import isEmptyObject from "@/helpers/isEmptyObject";
import { readdir } from "fs/promises";
import { type LavalinkManagerEvents, type NodeManagerEvents } from "lavalink-client";
import type { Event } from "@/typings/event";

export default async (client: ExtendedClient) => {
    try {
        const eventTypes = await readdir("./src/events", { withFileTypes: true });

        for (const typeDir of eventTypes) {
            if (!typeDir.isDirectory()) continue; // Chỉ xử lý nếu đó là thư mục

            const files = await readdir(`./src/events/${typeDir.name}`);
            const filteredFiles = files.filter(
                (f: string) => f.endsWith(".js") || f.endsWith(".ts"),
            );

            for (const file of filteredFiles) {
                try {
                    const module: Event = (
                        await import(`../events/${typeDir.name}/${file}`)
                    ).default;

                    if (!module || isEmptyObject(module)) {
                        client.logger.warn(`Module not found at: ${file}`);
                        continue;
                    }

                    if (module.options.ignore) {
                        client.logger.info(`Ignore event at: ${file}`);
                        continue;
                    }

                    const bindEvent = module.handler.bind(null, client);

                    // Kiểm tra loại event và đăng ký sự kiện
                    if (typeDir.name === "player") {
                        client.manager[module.options.once ? "once" : "on"](
                            module.name as keyof LavalinkManagerEvents,
                            bindEvent,
                        );
                    } else if (typeDir.name === "node") {
                        client.manager.nodeManager[module.options.once ? "once" : "on"](
                            module.name as keyof NodeManagerEvents,
                            bindEvent,
                        );
                    } else {
                        client[module.options.once ? "once" : "on"](
                            module.name,
                            bindEvent,
                        );
                    }
                } catch (err: any) {
                    client.logger.error(
                        `Error loading event from file ${file}: ${err.message}`,
                    );
                }
            }
        }
    } catch (err: any) {
        client.logger.error(`Failed to load events: ${err.message}`);
    }
};
