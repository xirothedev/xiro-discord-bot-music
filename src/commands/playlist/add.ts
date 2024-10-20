import config from "@/config";
import prefix from "@/layouts/prefix";
import type { Track } from "@prisma/client";
import { EmbedBuilder, userMention } from "discord.js";
import type { TrackData } from "typings";
import { Category } from "typings/utils";

export default prefix(
    "add",
    {
        description: {
            content: "Thêm bài hát vào playlist.",
            examples: ["add KPop Nơi này có anh"],
            usage: "add <tên playlist> <song>",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, message, args) => {
        const playlist = args.shift();
        const embed = new EmbedBuilder();
        const song = args.join(" ");

        if (!playlist) {
            return await message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp playlist").setColor(client.color.red)],
            });
        }

        if (!song) {
            return await message.channel.send({
                embeds: [embed.setDescription("Không có bài hát").setColor(client.color.red)],
            });
        }

        try {
            const res = await client.manager.search(song, message.author);

            if (!res || res.tracks.length === 0) {
                return await message.channel.send({
                    embeds: [embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi khi tìm kiếm.")],
                });
            }

            const playlistData = await client.prisma.playlist.findUnique({
                where: { userId_name: { name: playlist, userId: message.author.id } },
            });

            if (!playlistData) {
                return await message.channel.send({
                    embeds: [embed.setDescription("Không tìm thấy playlist").setColor(client.color.red)],
                });
            }

            const trackStrings: TrackData[] = [];
            let count = 0;
            if (res.loadType === "playlist") {
                res.tracks.forEach((track) => {
                    if (track.encoded) {
                        trackStrings.push({
                            name: track.info.title,
                            uri: track.info.uri,
                            encode: track.encoded,
                            duration: track.info.duration,
                        });
                        count++;
                    }
                });
            } else if (res.loadType === "track" || res.loadType === "search") {
                if (res.tracks[0].encoded) {
                    trackStrings.push({
                        name: res.tracks[0].info.title,
                        uri: res.tracks[0].info.uri,
                        encode: res.tracks[0].encoded,
                        duration: res.tracks[0].info.duration,
                    });
                    count = 1;
                }
            }

            await Promise.all(
                trackStrings.map(
                    async (trackString) => await client.utils.addTracksToPlaylist(playlistData, trackString),
                ),
            );

            return await message.channel.send({
                embeds: [embed.setDescription(`Đã thêm ${count} bài hát vào ${playlist}`).setColor(client.color.green)],
            });
        } catch (error) {
            console.error(error);
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
