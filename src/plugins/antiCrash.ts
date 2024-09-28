export default function antiCrash(client: ExtendedClient) {
    const handleExit = async (): Promise<void> => {
        if (client) {
            client.logger.star("Disconnecting from Discord...");
            await client.destroy();
            client.logger.success("Successfully disconnected from Discord!");
            client.logger.star("Disconnecting from Database...");
            await client.prisma.$disconnect();
            client.logger.star("Successfully disconnected from Database");
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
