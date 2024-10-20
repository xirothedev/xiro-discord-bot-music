import checkPremium from "@/helpers/checkPremium";
import resolveUserId from "@/helpers/resolveUserId";
import { PremiumErrorEmbedBuilder } from "@/interface/premium";
import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "steal",
    {
        description: {
            content: "Ăn trộm playlist.",
            examples: ["steal @Shiroko KPop", "steal @Shiroko EDM music-edm"],
            usage: "steal <id/user> <tên playlist> [tên cần đổi]",
        },
        aliases: ["st"],
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const targetUserArg = args[0];
        const playlistName = args[1];
        const playlistRename = args[2] || playlistName;

        if (!checkPremium(guild, user) && user.playlists.length >= 2) {
            return message.channel.send({
                embeds: [new PremiumErrorEmbedBuilder(client, "Bạn không thể tạo nhiều hơn 2 playlists")],
            });
        }

        const userId = await resolveUserId(client, targetUserArg, message);
        if (!userId) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Người dùng không hợp lệ.")],
            });
        }

        if (!playlistName) {
            return message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp tên playlist").setColor(client.color.red)],
            });
        }

        try {
            const playlistData = await client.prisma.playlist.findUnique({
                where: { userId_name: { userId, name: playlistName } },
                include: { tracks: true },
            });

            if (!playlistData) {
                return message.channel.send({
                    embeds: [embed.setDescription("Không tìm thấy playlist").setColor(client.color.red)],
                });
            }

            const existingPlaylist = user.playlists.find((f) => f.name === playlistRename);

            if (existingPlaylist) {
                return message.channel.send({
                    embeds: [embed.setDescription("Playlist của bạn đã tồn tại").setColor(client.color.red)],
                });
            }

            await client.prisma.playlist.create({
                data: {
                    name: playlistRename,
                    userId: message.author.id,
                    tracks: { createMany: { data: playlistData.tracks, skipDuplicates: true } },
                },
            });

            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(`Đã đánh cắp playlist \`${playlistName}\` từ <@${userId}> thành công.`)
                        .setColor(client.color.main),
                ],
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi trong quá trình xử lý.")],
            });
        }
    },
);
