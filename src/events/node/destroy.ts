import event from "@/layouts/event";
import type { DestroyReasonsType, LavalinkNode } from "lavalink-client";

export default event(
    "destroy",
    { once: false },
    async (client, node: LavalinkNode, destroyReason: DestroyReasonsType) => {
        client.logger.success(
            `Node ${node.id} is destroyed ${destroyReason ? "with reason " + destroyReason : ""}!`,
        );
    },
);
