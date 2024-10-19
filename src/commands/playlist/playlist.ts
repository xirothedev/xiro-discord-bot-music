import config from "@/config";
import prefix from "@/layouts/prefix";
import type { Playlist } from "@prisma/client";
import { EmbedBuilder, userMention, type User } from "discord.js";
import type { PlaylistWithTrack } from "typings";
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
    async (client, message, args) => {
        const embed = new EmbedBuilder();
        let playlist: PlaylistWithTrack | string | null = args[0];

        try {
            if (!playlist) {
                const playlists = await client.prisma.playlist.findMany({ where: { userId: message.author.id } });

                if (!playlists || playlists.length === 0) {
                    return await message.channel.send({
                        embeds: [embed.setColor(client.color.red).setDescription("Người dùng không có playlist.")],
                    });
                }

                return await message.channel.send({
                    embeds: [
                        embed
                            .setTitle(`Playlist của bạn`)
                            .setDescription(playlists.map((playlist: any) => playlist.name).join("\n"))
                            .setColor(client.color.main),
                    ],
                });
            } else {
                playlist = await client.prisma.playlist.findUnique({
                    where: { userId_name: { userId: message.author.id, name: playlist } },
                    include: { tracks: true },
                });
                if (!playlist) {
                    return await message.channel.send({
                        embeds: [embed.setColor(client.color.red).setDescription("Playlist không tồn tại.")],
                    });
                }

                const songStrings: string[] = [];
                for (let i = 0; i < playlist.tracks.length; i++) {
                    const track = playlist.tracks[i];
                    songStrings.push(
                        `${i + 1}. [${track.name}](${track.uri}) - Thời lượng: \`${client.utils.formatTime(
                            track.duration,
                        )}\``,
                    );
                }

                let chunks = client.utils.chunk(songStrings, 10);

                if (chunks.length === 0) chunks = [songStrings];

                const pages = chunks.map((chunk, index) => {
                    return new EmbedBuilder()
                        .setColor(client.color.main)
                        .setAuthor({
                            name: `Playlist ${(playlist as Playlist).name} của @${message.author.username}`,
                            iconURL: message.guild.iconURL()!,
                        })
                        .setDescription(chunk.join("\n"))
                        .setFooter({ text: `Trang ${index + 1} của ${chunks.length}` });
                });

                return await client.utils.paginate(client, message, pages);
            }
        } catch (error) {
            const log = client.utils.createLog(client, JSON.stringify(error), Bun.main, message.author);
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(
                            `Đã xảy ra lỗi. Vui lòng báo mã lỗi \`${(await log).logId}\` cho ${userMention(config.users.ownerId)}!`,
                        ),
                ],
            });
        }
    },
);
