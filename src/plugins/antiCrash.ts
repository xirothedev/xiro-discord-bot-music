export default function antiCrash(client: ExtendedClient) {
    const handleExit = async (): Promise<void> => {
        if (client) {
            client.logger.star("Disconnecting from Discord...");
            await client.destroy();
            client.logger.success("Successfully disconnected from Discord!");
            process.exit();
        }
    };
    process.on("unhandledRejection", (reason, promise) => {
        client.logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    });
    process.on("uncaughtException", (err) => {
        client.logger.error("Uncaught Exception thrown:", err);
    });
    process.on("SIGINT", handleExit);
    process.on("SIGTERM", handleExit);
    process.on("SIGQUIT", handleExit);
}
