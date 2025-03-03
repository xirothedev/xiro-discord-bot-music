import { resetVoiceChannel, updateVoiceChannel } from "@/functions/voiceChannel";
import event from "@/layouts/event";
import { EmbedBuilder, TextChannel, type VoiceState } from "discord.js";

export default event(
    "voiceStateUpdate",
    { once: false },
    async (client, oldState: VoiceState, newState: VoiceState) => {
        const player = client.manager.getPlayer(oldState.guild.id);

        if (
            oldState.channel &&
            oldState.channel.members.size <= 1 &&
            oldState.channel.members.has(client.user.id) &&
            oldState.channel.id !== "1316310231516712961" // can thiệp
        ) {
            if (player.connected) {
                await player.destroy();
                await resetVoiceChannel(client);
            }
        }

        if (oldState.channel && !newState.channel && oldState.member?.id === client.user.id) {
            await resetVoiceChannel(client);
        }

        if (!oldState.channel && newState.channel && newState.member?.id === client.user.id) {
            const bot = await client.prisma.bot.findUnique({
                where: { voiceId: newState.channel.id, NOT: { botId: client.user.id } },
            });

            const guild = await client.prisma.guild.upsert({
                where: { guildId: newState.channel.guildId },
                create: { guildId: newState.channel.guildId },
                update: {},
            });

            if (bot) {
                await player.destroy();

                if (player.textChannelId) {
                    const channel = (await newState.guild.channels.cache.get(player.textChannelId!)) as TextChannel;
                    await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color.red)
                                .setDescription(client.locale(guild, "handler.duplicate_bot")),
                        ],
                    });
                }

                return;
            }

            await updateVoiceChannel(client, newState.channel.id);
        }
    },
);
