declare namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string;
        readonly GUILD_ID: string;
        readonly BETA_ROLE_ID: string;
        readonly BETA_CHANNEL_ID: string;
    }
}
