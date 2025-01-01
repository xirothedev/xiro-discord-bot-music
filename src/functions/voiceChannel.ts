export async function resetVoiceChannel(client: ExtendedClient) {
    return await client.prisma.bot.update({
        where: { botId: client.user.id },
        data: { voiceId: null },
    });
}

export async function updateVoiceChannel(client: ExtendedClient, channelId: string) {
    return await client.prisma.bot.update({
        where: { botId: client.user.id },
        data: { voiceId: channelId },
    });
}
