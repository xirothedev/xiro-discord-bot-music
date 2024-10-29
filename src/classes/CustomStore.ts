// import type { QueueStoreManager, StoredQueue } from "lavalink-client";

// export class CustomStore implements QueueStoreManager {
//     constructor(private client: ExtendedClient) {}
//     async get(guildId: unknown): Promise<unknown> {
//         return await this.client.redis.get(this.id(guildId as string));
//     }
//     async set(guildId: unknown, stringifiedQueueData: unknown): Promise<unknown> {
//         return await this.client.redis.set(this.id(guildId as string), stringifiedQueueData as string);
//     }
//     async delete(guildId: unknown): Promise<unknown> {
//         return await this.client.redis.del(this.id(guildId as string));
//     }
//     async parse(stringifiedQueueData: unknown): Promise<Partial<StoredQueue>> {
//         return JSON.parse(stringifiedQueueData as string);
//     }
//     async stringify(parsedQueueData: any): Promise<any> {
//         return JSON.stringify(parsedQueueData);
//     }
//     private id(guildId: string) {
//         return `lavalinkqueue_${guildId}`;
//     }
// }
