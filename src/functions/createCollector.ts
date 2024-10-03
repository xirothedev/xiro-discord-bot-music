import { ButtonInteraction, GuildMember } from "discord.js";
import type { Player, Track } from "lavalink-client";
import { createButtonRow } from "./createButtonRow";

export default function createCollector(
    message: any,
    player: Player,
    _track: Track,
    embed: any,
    client: ExtendedClient
): void {
    const collector = message.createMessageComponentCollector({
        filter: async (b: ButtonInteraction) => {
            if (b.member instanceof GuildMember) {
                const isSameVoiceChannel = b.guild?.members.me?.voice.channelId === b.member.voice.channelId;
                if (isSameVoiceChannel) return true;
            }
            await b.reply({
                content: `Bạn không kết nối ${
                    b.guild?.members.me?.voice.channelId ? `với <#${b.guild.members.me.voice.channelId}> ` : ""
                }để sử dụng các nút này.`,
                ephemeral: true,
            });
            return false;
        },
    });

    collector.on("collect", async (interaction: ButtonInteraction<"cached">) => {
        const editMessage = async (text: string): Promise<void> => {
            if (message) {
                await message.edit({
                    embeds: [
                        embed.setFooter({
                            text,
                            iconURL: interaction.user.avatarURL(),
                        }),
                    ],
                    components: [createButtonRow(player, client)],
                });
            }
        };

        const player = client.manager.getPlayer(interaction.guildId);
        if (player?.connected && player?.voiceChannelId) {
            if (player?.voiceChannelId !== message.member?.voice.channelId) {
                return await interaction.reply({
                    embeds: [
                        embed
                            .setColor(client.color.red)
                            .setDescription("❌ **|** Bạn phải ở cùng phòng với bot để sử dụng nút này."),
                    ],
                });
            }

            const room = await client.prisma.room.findUnique({ where: { roomId: player.voiceChannelId } });

            if (room && room.ownerId !== message.author.id) {
                return await message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color.red)
                            .setDescription("❌ **|** Bạn phải là người điều khiển bot để sử dụng nút này."),
                    ],
                });
            }
        }

        switch (interaction.customId) {
            case "previous":
                if (player.queue.previous) {
                    await interaction.deferUpdate();
                    const previousTrack = player.queue.previous[0];
                    player.play({
                        track: previousTrack,
                    });
                    await editMessage(`Trước đó bởi ${interaction.user.tag}`);
                } else {
                    await interaction.reply({
                        content: "Không có bài hát trước.",
                        ephemeral: true,
                    });
                }
                break;
            case "resume":
                if (player.paused) {
                    player.resume();
                    await interaction.deferUpdate();
                    await editMessage(`Tiếp tục bởi ${interaction.user.tag}`);
                } else {
                    player.pause();
                    await interaction.deferUpdate();
                    await editMessage(`Tạm dừng bởi ${interaction.user.tag}`);
                }
                break;
            case "stop": {
                player.stopPlaying(true, false);
                await interaction.deferUpdate();
                break;
            }
            case "skip":
                if (player.queue.tracks.length > 0) {
                    await interaction.deferUpdate();
                    player.skip();
                    await editMessage(`Bỏ qua bởi ${interaction.user.tag}`);
                } else {
                    await interaction.reply({
                        content: "Không còn bài hát nào trong danh sách phát.",
                        ephemeral: true,
                    });
                }
                break;
            case "loop": {
                await interaction.deferUpdate();
                switch (player.repeatMode) {
                    case "off": {
                        player.setRepeatMode("track");
                        await editMessage(`Lặp lại bởi bởi ${interaction.user.tag}`);
                        break;
                    }
                    case "track": {
                        player.setRepeatMode("queue");
                        await editMessage(`Lặp lại danh sách phát bởi bởi ${interaction.user.tag}`);
                        break;
                    }
                    case "queue": {
                        player.setRepeatMode("off");
                        await editMessage(`Tắt lặp lại bởi ${interaction.user.tag}`);
                        break;
                    }
                }
                break;
            }

            case "shuffle": {
                await interaction.deferUpdate();
                await player.queue.shuffle()
            }
        }
    });
}
