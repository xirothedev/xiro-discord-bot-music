import bots from "../bots.json";
import ExtendedClient, { logger, prisma } from "./classes/ExtendedClient";
import checkEnv from "./plugins/checkEnv";

console.clear();    

(() => {
    const isValidEnv = checkEnv(logger);
    if (!isValidEnv) {
        process.exit(1);
    } else {
        logger.success("Loaded all envs");
    }

    bots.forEach(async ({ token, prefix }, index) => {
        if (!token || !prefix) {
            return logger.error(
                `Index ${index} of bots.json / bots.prod.json is missing token and prefix, please add more`,
            );
        }

        const client = new ExtendedClient();
        await client.start(token, prefix);
    });
})();
