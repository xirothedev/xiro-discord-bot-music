import botsProd from "../bots.json";
import ExtendedClient, { logger } from "./classes/ExtendedClient";
import checkEnv from "./plugins/checkEnv";

console.clear();

(async () => {
    if (!checkEnv(logger)) {
        process.exit(1);
    }
    logger.success("Loaded all envs");

    const invalidBots = botsProd.filter(({ token, prefix }) => !token || !prefix);
    if (invalidBots.length > 0) {
        invalidBots.forEach(({ token, prefix }, index) => {
            logger.error(`Index ${index} of bots.json / bots.prod.json is missing token or prefix`);
        });
        return process.exit(1);
    }

    // Khởi chạy các bot tuần tự
    for (const { token, prefix } of botsProd) {
        try {
            const client = new ExtendedClient();
            await client.start(token, prefix);
            logger.success(`Client with prefix ${prefix} started successfully`);
        } catch (error: any) {
            logger.error(`Failed to start client with prefix ${prefix}: ${error.message}`);
        }
    }
})();
