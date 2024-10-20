import config from "@/config";
import prefix from "@/layouts/prefix";
import { EmbedBuilder, User, userMention } from "discord.js";
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
    async (client, message, args) => {
        const playlistName = args[1];
        const playlistRename = args[2] || playlistName;
        const embed = new EmbedBuilder();
        let userId: string | undefined | null;
        let targetUser: undefined | string | User = args[0];

        if (targetUser?.startsWith("<@") && targetUser.endsWith(">")) {
            targetUser = targetUser.slice(2, -1);
            if (targetUser.startsWith("!")) {
                targetUser = targetUser.slice(1);
            }
            targetUser = await client.users.fetch(targetUser);
            userId = targetUser.id;
        } else if (targetUser) {
            try {
                targetUser = await client.users.fetch(targetUser);
                userId = targetUser.id;
            } catch (_error) {
                const users = client.users.cache.filter(
                    (user) => user.username.toLowerCase() === (targetUser as string).toLowerCase(),
                );

                if (users.size > 0) {
                    targetUser = users.first();
                    userId = targetUser?.id;
                } else {
                    return await message.channel.send({
                        embeds: [embed.setColor(client.color.red).setDescription("Người dùng không hợp lệ.")],
                    });
                }
            }
        }

        if (!playlistName) {
            return await message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp playlist").setColor(client.color.red)],
            });
        }

        if (!userId) {
            return await message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp người dùng").setColor(client.color.red)],
            });
        }

        try {
            const playlistData = await client.prisma.playlist.findUnique({
                where: { userId_name: { name: playlistName, userId } },
                include: { tracks: true },
            });

            if (!playlistData) {
                return await message.channel.send({
                    embeds: [embed.setDescription("Không tìm thấy playlist").setColor(client.color.red)],
                });
            }

            const existingPlaylist = await client.prisma.playlist.findUnique({
                where: { userId_name: { name: playlistRename, userId: message.author.id } },
            });
            if (existingPlaylist) {
                return await message.channel.send({
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

            return await message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `Đã đánh cắp playlist \`${playlistName}\` từ ${targetUser?.toString() || targetUser} thành công.`,
                        )
                        .setColor(client.color.main),
                ],
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
