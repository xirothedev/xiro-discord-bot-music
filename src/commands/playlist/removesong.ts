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
    async (client, message, args) => {
        const playlist = args.shift();
        const song = Number(args[0]);
        const embed = new EmbedBuilder();

        if (!playlist) {
            return await message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp tên playlist").setColor(client.color.red)],
            });
        }

        if (isNaN(song)) {
            return await message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp bài hát").setColor(client.color.red)],
            });
        }

        const playlistData = await client.prisma.playlist.findUnique({
            where: { userId_name: { name: playlist, userId: message.author.id } },
            include: { tracks: true },
        });

        if (!playlistData) {
            return await message.channel.send({
                embeds: [embed.setDescription("Playlist không tồn tại").setColor(client.color.red)],
            });
        }

        if (song <= 0 || song >= playlistData.tracks.length) {
            return await message.channel.send({
                embeds: [embed.setDescription("Chỉ mục không hợp lệ").setColor(client.color.red)],
            });
        }

        const trackToRemove = playlistData.tracks[song - 1];

        await client.prisma.playlist.update({
            where: { userId_name: { name: playlistData.name, userId: playlistData.userId } },
            data: { tracks: { delete: { track_id: trackToRemove.track_id } } },
        });

        await message.channel.send({
            embeds: [
                embed
                    .setDescription(`Đã xóa \`${trackToRemove.name}\` khỏi \`${playlist}\`.`)
                    .setColor(client.color.green),
            ],
        });
    },
);
