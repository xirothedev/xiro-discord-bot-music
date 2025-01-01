import type { Message } from "discord.js";

async function resolveUserId(
    client: ExtendedClient,
    targetUserArg: string,
    message: Message<true>,
) {
    if (
        !targetUserArg ||
        !targetUserArg.startsWith("<@") ||
        !targetUserArg.endsWith(">")
    ) {
        return null;
    }

    const userId = targetUserArg.replace(/<@!?/, "").replace(/>/, "");
    try {
        const user = await client.users.fetch(userId);
        return user.id;
    } catch {
        const users = client.users.cache.filter(
            (user) => user.username.toLowerCase() === targetUserArg.toLowerCase(),
        );
        return users.size > 0 ? users.first()?.id : null;
    }
}

export default resolveUserId;
