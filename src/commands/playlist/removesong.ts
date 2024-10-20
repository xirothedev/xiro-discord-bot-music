import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "removesong",
    {
        description: {
            content: "Xóa bài hát khỏi playlist.",
            examples: ["removesong KPop 1"],
            usage: "removesong <tên playlist> <số thứ tự bài hát trong playlist>",
        },
        aliases: ["rms"],
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const playlistName = args.shift();
        const songIndex = Number(args[0]);

        if (!playlistName) {
            return message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp tên playlist").setColor(client.color.red)],
            });
        }

        if (isNaN(songIndex) || songIndex <= 0) {
            return message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp số thứ tự bài hát hợp lệ").setColor(client.color.red)],
            });
        }

        const playlistData = user.playlists.find((f) => f.name === playlistName);

        if (!playlistData) {
            return message.channel.send({
                embeds: [embed.setDescription("Playlist không tồn tại").setColor(client.color.red)],
            });
        }

        if (songIndex > playlistData.tracks.length) {
            return message.channel.send({
                embeds: [embed.setDescription("Chỉ mục không hợp lệ").setColor(client.color.red)],
            });
        }

        const trackToRemove = playlistData.tracks[songIndex - 1];

        await client.prisma.playlist.update({
            where: { playlist_id: playlistData.playlist_id },
            data: { tracks: { delete: { track_id: trackToRemove.track_id } } },
        });

        return message.channel.send({
            embeds: [
                embed
                    .setDescription(`Đã xóa \`${trackToRemove.name}\` khỏi \`${playlistName}\`.`)
                    .setColor(client.color.green),
            ],
        });
    },
);
