import Logger from "@/helpers/logger";

export default function checkEnv(logger: Logger) {
    const envs = process.env;
    let isValid = true;

    const required = ["DATABASE_URL"];

    required.forEach((key) => {
        if (!envs[key]) {
            isValid = false;
            logger.error(`Missing env: ${key}`);
        }
    });

    return isValid;
}
