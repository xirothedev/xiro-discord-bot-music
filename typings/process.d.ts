declare namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string;
        readonly GUILD_ID: string;
        readonly LAVALINK_SERVER_PASSWORD: string;
        readonly LAVALINK_SERVER_HOST: string;
        readonly LAVALINK_SERVER_PORT: string;
        readonly DATABASE_URL_REPLICA_1: string
        readonly MODE?: string;
    }
}