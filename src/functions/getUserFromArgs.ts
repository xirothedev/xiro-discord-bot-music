export default async function getUserFromArgs(client: ExtendedClient, input: string) {
    const mentionRegex = /^<@!?(\d+)>$/;
    const mentionMatch = input.match(mentionRegex);

    let userId;

    if (mentionMatch) {
        userId = mentionMatch[1];
    } else if (/^\d+$/.test(input)) {
        userId = input;
    } else {
        return null;
    }

    try {
        const user = await client.users.fetch(userId);
        return user;
    } catch (error) {
        return null;
    }
}
