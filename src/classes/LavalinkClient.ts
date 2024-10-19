import { autoPlayFunction, requesterTransformer } from "@/helpers/player";
import { LavalinkManager, type SearchPlatform, type SearchResult } from "lavalink-client";

export default class LavalinkClient extends LavalinkManager {
    public client: ExtendedClient;
    constructor(client: ExtendedClient) {
        super({
            nodes: [
                {
                    id: "localnode",
                    host: process.env.LAVALINK_SERVER_HOST,
                    port: +process.env.LAVALINK_SERVER_PORT,
                    authorization: process.env.LAVALINK_SERVER_PASSWORD,
                    requestSignalTimeoutMS: 3000,
                    closeOnError: true,
                    heartBeatInterval: 30_000,
                    enablePingOnStatsCheck: true,
                    retryDelay: 10e3,
                    secure: false,
                    retryAmount: 5,
                },
            ],
            sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
            queueOptions: {
                maxPreviousTracks: 25,
            },
            playerOptions: {
                defaultSearchPlatform: "youtube music",
                onDisconnect: {
                    autoReconnect: true,
                    destroyPlayer: false,
                },
                requesterTransformer,
                onEmptyQueue: { destroyAfterMs: 90_000, autoPlayFunction },
            },
        });
        this.client = client;
    }

    public async search(query: string, user: unknown, source?: SearchPlatform): Promise<SearchResult> {
        const nodes = this.nodeManager.leastUsedNodes();
        const node = nodes[Math.floor(Math.random() * nodes.length)];
        const result = await node.search({ query, source }, user, false);
        return result;
    }
}
