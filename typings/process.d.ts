declare namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string;
        readonly GUILD_ID: string;
        readonly BETA_ROLE_ID: string;
        readonly BETA_CHANNEL_ID: string;
        readonly BOOSTER_ROLE_ID: string;
        readonly DONATOR_ROLE_ID: string;
        readonly LAVALINK_SERVER_PASSWORD: string;
        readonly LAVALINK_SERVER_HOST: string;
        readonly LAVALINK_SERVER_PORT: string;
        readonly MODE?: string;
    }
}