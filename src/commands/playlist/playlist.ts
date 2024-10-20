import checkPremium from "@/helpers/checkPremium";
import prefix from "@/layouts/prefix";
import type { Playlist } from "@prisma/client";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "playlist",
    {
        description: {
            content: "Hiển thị playlist.",
            examples: ["playlist piano"],
            usage: "playlist <tên playlist>",
        },
        aliases: ["list", "album"],
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
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
                        embeds: [embed.setColor(client.color.red).setDescription("Người dùng không có playlist.")],
                    });
                }

                const playlistNames = user.playlists
                    .map((playlist, index) => {
                        if (limitedPlaylists.find((f) => f.playlist_id === playlist.playlist_id)) {
                            return `${index + 1}. \`${playlist.name}\` • ${playlist.tracks.length} bài hát`;
                        } else {
                            return `~~${index + 1}. ${playlist.name} • ${playlist.tracks.length} bài hát~~`;
                        }
                    })
                    .join("\n");
                return message.channel.send({
                    embeds: [
                        embed
                            .setAuthor({
                                iconURL: message.guild.iconURL() || undefined,
                                name: `Playlist của @${message.author.username}`,
                            })
                            .setDescription(playlistNames)
                            .setColor(client.color.main)
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
                    embeds: [embed.setColor(client.color.red).setDescription("Playlist không tồn tại.")],
                });
            }

            if (playlist.tracks.length === 0) {
                return message.channel.send({
                    embeds: [embed.setColor(client.color.red).setDescription("Playlist không có bài hát.")],
                });
            }

            const songStrings = playlist.tracks.map(
                (track, index) =>
                    `${index + 1}. [${track.name}](${track.uri}) - Thời lượng: \`${client.utils.formatTime(track.duration)}\``,
            );

            const chunks = client.utils.chunk(songStrings, 10);
            const pages = chunks.map((chunk, index) =>
                new EmbedBuilder()
                    .setColor(client.color.main)
                    .setAuthor({
                        name: `Playlist ${(playlist as Playlist).name} của @${message.author.username}`,
                        iconURL: message.guild.iconURL()!,
                    })
                    .setDescription(chunk.join("\n"))
                    .setFooter({ text: `Trang ${index + 1} của ${chunks.length}` }),
            );

            return await client.utils.paginate(client, message, pages);
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi trong quá trình thực hiện lệnh."),
                ],
            });
        }
    },
);
