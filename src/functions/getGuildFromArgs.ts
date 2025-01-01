export default async function getGuildFromArgs(client: ExtendedClient, input: string) {
    const mentionRegex = /^<@!?(\d+)>$/;
    const mentionMatch = input.match(mentionRegex);

    let guildId;

    if (mentionMatch) {
        guildId = mentionMatch[1];
    } else if (/^\d+$/.test(input)) {
        guildId = input;
    } else {
        return null;
    }

    try {
        const guild = await client.guilds.fetch(guildId);
        return guild;
    } catch (error) {
        return null;
    }
}
