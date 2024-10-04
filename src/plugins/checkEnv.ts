import Logger from "@/helpers/logger";

export default function checkEnv(logger: Logger) {
    const envs = process.env;
    let isValid = true;

    const required = [
        "DATABASE_URL",
        "GUILD_ID",
        "BETA_CHANNEL_ID",
        "BETA_ROLE_ID",
        "LAVALINK_SERVER_PASSWORD",
        "LAVALINK_SERVER_HOST",
        "LAVALINK_SERVER_PORT",
    ];

    required.forEach((key) => {
        if (!envs[key]) {
            isValid = false;
            logger.error(`Missing env: ${key}`);
        }
    });

    return isValid;
}
