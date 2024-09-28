import event from "@/layouts/event";
import type { LavalinkNode } from "lavalink-client";

export default event("connect", { once: false }, async (client, node: LavalinkNode) => {
    client.logger.success(`Node ${node.id} is ready!`);
});
