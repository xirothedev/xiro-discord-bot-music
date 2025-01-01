import Logger from "@/helpers/logger";

export default function checkEnv(logger: Logger) {
    const envs = process.env;
    let isValid = true;

    const required = [
        "DATABASE_URL",
        "GUILD_ID",
        "LAVALINK_SERVER_PASSWORD",
        "LAVALINK_SERVER_HOST",
        "LAVALINK_SERVER_PORT",
        "GENIUS_ACCESS_TOKEN",
        "DISCORD_BOT_TOKEN",
        "DISCORD_BOT_ID",
        "PREFIX",
    ];

    required.forEach((key) => {
        if (!envs[key]) {
            isValid = false;
            logger.error(`Missing env: ${key}`);
        }
    });

    return isValid;
}
