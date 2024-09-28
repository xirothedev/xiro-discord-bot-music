import { ShardingManager } from "discord.js";
import type Logger from "@/helpers/logger";

export async function shardStart(logger: Logger, token: string) {
    const manager = new ShardingManager("./src/index.ts", {
        respawn: true,
        token,
        totalShards: "auto",
        shardList: "auto",
    });
    manager.on("shardCreate", (shard) => {
        shard.on("ready", () => {
            logger.start(`[CLIENT] Shard ${shard.id} connected to Discord's Gateway.`);
        });
    });

    await manager.spawn();

    logger.start(`[CLIENT] ${manager.totalShards} shard(s) spawned.`);
}
