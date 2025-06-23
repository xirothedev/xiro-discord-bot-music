import checkPremium from "@/helpers/checkPremium";
import prefix from "@/layouts/prefix";
import type { Playlist } from "prisma/generated";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "playlist",
    {
        description: {
            content: "desc.playlist",
            examples: ["playlist", "playlist piano"],
            usage: "playlist (playlist)",
        },
        aliases: ["list", "album"],
        cooldown: "5s",
        botPermissions: [
            "SendMessages",
            "ReadMessageHistory",
            "ViewChannel",
            "EmbedLinks",
        ],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const playlistName = args[0];

        try {
            if (!playlistName) {
                let limitedPlaylists = user.playlists;
                if (!checkPremium(guild, user)) {
                    limitedPlaylists = user.playlists.slice(0, 2);
                }

                if (!user.playlists || user.playlists.length === 0) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color.red)
                                .setDescription(
                                    T(guild.language, "error.user_dont_have_playlist"),
                                ),
                        ],
                    });
                }

                const playlistNames = user.playlists
                    .map((playlist, index) => {
                        if (
                            limitedPlaylists.find(
                                (f) => f.playlist_id === playlist.playlist_id,
                            )
                        ) {
                            return `${index + 1}. \`${playlist.name}\` • ${playlist.tracks.length} ${T(guild.language, "use_many.song")}`;
                        } else {
                            return `~~${index + 1}. ${playlist.name} • ${playlist.tracks.length} ${T(guild.language, "use_many.song")}~~`;
                        }
                    })
                    .join("\n");
                return message.channel.send({
                    embeds: [
                        embed
                            .setAuthor({
                                iconURL: message.guild.iconURL() || undefined,
                                name: T(guild.language, "use_many.playlist_of", {
                                    username: message.author.username,
                                }),
                            })
                            .setDescription(playlistNames)
                            .setColor(client.color.main)
                            .setFooter({
                                iconURL: message.author.displayAvatarURL(),
                                text: `@${message.author.username}`,
                            })
                            .setFooter({
                                iconURL: message.author.displayAvatarURL(),
                                text: `@${message.author.username}`,
                            })
                            .setTimestamp(),
                    ],
                });
            }

            const playlist = user.playlists.find((f) => f.name === playlistName);

            if (!playlist) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color.red)
                            .setDescription(
                                T(guild.language, "error.playlist.playlist_not_found"),
                            ),
                    ],
                });
            }

            if (playlist.tracks.length === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color.red)
                            .setDescription(
                                T(guild.language, "error.playlist.empty_playlist"),
                            ),
                    ],
                });
            }

            const songStrings = playlist.tracks.map(
                (track, index) =>
                    `${index + 1}. [${track.name}](${track.uri}) - ${T(guild.language, "use_many.duration")}: \`${client.utils.formatTime(track.duration)}\``,
            );

            const chunks = client.utils.chunk(songStrings, 10);
            const pages = chunks.map((chunk, index) =>
                new EmbedBuilder()
                    .setColor(client.color.main)
                    .setAuthor({
                        name: T(guild.language, "use_many.playlist_name_of", {
                            name: playlist.name,
                            username: message.author.username,
                        }),
                        iconURL: message.guild.iconURL()!,
                    })
                    .setDescription(chunk.join("\n"))
                    .setFooter({
                        iconURL: message.author.displayAvatarURL(),
                        text: T(guild.language, "use_many.page_of", {
                            index: index + 1,
                            total: chunks.length,
                        }),
                    })
                    .setTimestamp(),
            );

            return await client.utils.paginate(client, message, pages);
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(T(guild.language, "error.common.error")),
                ],
            });
        }
    },
);
