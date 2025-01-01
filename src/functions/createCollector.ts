import { ButtonInteraction, Message } from "discord.js";
import type { Player, Track } from "lavalink-client";
import { createButtonRow } from "./createButtonRow";
import { T } from "@/handlers/i18n";
import { prisma } from "@/classes/ExtendedClient";

export default function createCollector(
    message: Message,
    player: Player,
    track: Track,
    embed: any,
    client: ExtendedClient,
): void {
    const collector = message.createMessageComponentCollector();

    collector.on("collect", async (interaction: ButtonInteraction<"cached">) => {
        if (
            interaction.guild.members.me?.voice.channelId !==
            interaction.member.voice.channelId
        ) {
            return await interaction.reply({
                content: `Bạn không kết nối ${interaction.guild.members.me?.voice.channelId ? `với <#${interaction.guild.members.me.voice.channelId}>` : ""}để sử dụng các nút này.`,
                ephemeral: true,
            });
        }

        const editMessage = async (text: string): Promise<void> => {
            if (message) {
                await message.edit({
                    embeds: [
                        embed.setFooter({
                            text,
                            iconURL: interaction.user.avatarURL(),
                        }),
                    ],
                    components: createButtonRow(player, client),
                });
            }
        };

        const guild = await prisma.guild.findUnique({
            where: { guildId: interaction.guild.id },
        });

        switch (interaction.customId) {
            case "previous":
                if (player.queue.previous) {
                    await interaction.deferUpdate();
                    const previousTrack = player.queue.previous[0];
                    player.play({
                        track: previousTrack,
                    });
                    await editMessage(T(guild?.language!, "collector.previous", {
                        user: interaction.user.tag,
                    }));
                } else {
                    await interaction.reply({
                        content: T(guild?.language!, "collector.no_previous_track"),
                        ephemeral: true,
                    });
                }
                break;
            case "resume":
                if (player.paused) {
                    player.resume();
                    await interaction.deferUpdate();
                    await editMessage(
                        T(guild?.language!, "collector.resume", {
                            user: interaction.user.tag,
                        }),
                    );
                } else {
                    player.pause();
                    await interaction.deferUpdate();
                    await editMessage(
                        T(guild?.language!, "collector.stop", {
                            user: interaction.user.tag,
                        }),
                    );
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
                    await editMessage(
                        T(guild?.language!, "collector.skip", {
                            user: interaction.user.tag,
                        }),
                    );
                } else {
                    await interaction.reply({
                        content: T(guild?.language!, "collector.no_previous_track"),
                        ephemeral: true,
                    });
                }
                break;
            case "loop": {
                await interaction.deferUpdate();
                switch (player.repeatMode) {
                    case "off": {
                        player.setRepeatMode("track");
                        await editMessage(
                            T(guild?.language!, "collector.loop.track", {
                                user: interaction.user.tag,
                            }),
                        );
                        break;
                    }
                    case "track": {
                        player.setRepeatMode("queue");
                        await editMessage(
                            T(guild?.language!, "collector.loop.queue", {
                                user: interaction.user.tag,
                            }),
                        );
                        break;
                    }
                    case "queue": {
                        player.setRepeatMode("off");
                        await editMessage(
                            T(guild?.language!, "collector.loop.off", {
                                user: interaction.user.tag,
                            }),
                        );
                        break;
                    }
                }
                break;
            }

            case "shuffle": {
                await interaction.deferUpdate();
                await player.queue.shuffle();
                await editMessage(
                    T(guild?.language!, "collector.shuffle", {
                        user: interaction.user.tag,
                    }),
                );
                break;
            }
        }
    });
}
