import { ShardingManager, Shard } from "discord.js";
import type Logger from "@/helpers/logger";

export async function shardStart(client: ExtendedClient, token: string) {
    const manager = new ShardingManager("./src/index.ts", {
        respawn: true,
        token,
        totalShards: "auto", // Hoặc chỉ định số shard cụ thể nếu cần
        shardList: "auto",
    });

    // Lắng nghe sự kiện khi một shard được tạo
    manager.on("shardCreate", (shard: Shard) => {
        client.logger.start(
            `[CLIENT] Shard ${shard.id} created, waiting for it to connect...`,
        );

        shard.on("ready", () => {
            client.logger.start(
                `[CLIENT] Shard ${shard.id} successfully connected to Discord's Gateway.`,
            );
        });

        shard.on("disconnect", () => {
            client.logger.warn(`[CLIENT] Shard ${shard.id} disconnected.`);
        });

        shard.on("reconnecting", () => {
            client.logger.warn(`[CLIENT] Shard ${shard.id} is reconnecting...`);
        });

        shard.on("death", () => {
            client.logger.error(`[CLIENT] Shard ${shard.id} process died.`);
        });
    });

    // Bao bọc quá trình spawn shard bằng try/catch để xử lý lỗi
    try {
        await manager.spawn(); // Spawn tất cả các shards
        client.logger.start(
            `[CLIENT] ${manager.totalShards} shard(s) spawned successfully.`,
        );
    } catch (error: any) {
        client.logger.error(`[CLIENT] Failed to spawn shards: ${error.message}`);
    }
}
