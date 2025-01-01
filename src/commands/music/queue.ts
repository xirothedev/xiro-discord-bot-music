import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import type { Requester } from "@/typings/player";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "queue",
    {
        description: {
            content: "desc.queue",
            examples: ["queue"],
            usage: "queue",
        },
        aliases: ["q"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: [
            "SendMessages",
            "ReadMessageHistory",
            "ViewChannel",
            "EmbedLinks",
        ],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(T(guild.language, "error.common.no_player")),
                ],
            });
        }

        const currentTrack = player.queue.current;
        if (currentTrack && player.queue.tracks.length === 0) {
            return message.channel.send({
                embeds: [
                    embed.setColor(client.color.main).setDescription(
                        T(guild.language, "use_many.player.playing") +
                            ": " +
                            T(guild.language, "use_many.player.description", {
                                title: currentTrack.info.title,
                                uri: currentTrack.info.uri,
                                requesterId: (currentTrack.requester as Requester).id,
                                duration: currentTrack.info.isStream
                                    ? T(guild.language, "use_many.player.stream")
                                    : client.utils.formatTime(currentTrack.info.duration),
                            }),
                    ),
                ],
            });
        }

        const songStrings = player.queue.tracks.map((track, index) => {
            return `${index + 1}. ${T(guild.language, "use_many.player.description", {
                title: track.info.title,
                uri: track.info.uri,
                requesterId: (track.requester as Requester).id,
                duration: track.info.isStream
                    ? T(guild.language, "use_many.player.stream")
                    : client.utils.formatTime(track.info.duration ?? 0),
            })}`;
        });

        const chunks = client.utils.chunk(songStrings, 10);
        const pages = chunks.map((chunk, index) =>
            new EmbedBuilder()
                .setColor(client.color.main)
                .setAuthor({
                    name: T(guild.language, "use_many.queue"),
                    iconURL: message.guild.iconURL()!,
                })
                .setDescription(chunk.join("\n"))
                .setFooter({
                    text: T(guild.language, "use_many.page_of", {
                        index: index + 1,
                        total: chunks.length,
                    }),
                }),
        );

        return client.utils.paginate(client, message, pages);
    },
);
