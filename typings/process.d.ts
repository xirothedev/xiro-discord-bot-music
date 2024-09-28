declare namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string;
        readonly GUILD_ID: string;
    }
}
