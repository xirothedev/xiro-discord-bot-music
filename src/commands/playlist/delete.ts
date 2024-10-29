import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "delete",
    {
        description: {
            content: "Xóa playlist.",
            examples: ["delete KPop"],
            usage: "delete [tên playlist]",
        },
        aliases: ["del"],
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const playlistName = args[0];

        if (!playlistName) {
            return message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp tên playlist để xóa.").setColor(client.color.red)],
            });
        }

        const playlistExists = user.playlists.find((f) => f.name === playlistName);

        if (!playlistExists) {
            return message.channel.send({
                embeds: [embed.setDescription("Playlist không tồn tại.").setColor(client.color.red)],
            });
        }

        try {
            await client.prisma.playlist.delete({ where: { playlist_id: playlistExists.playlist_id } });

            return message.channel.send({
                embeds: [
                    embed.setDescription(`Đã xóa danh sách phát **${playlistName}**.`).setColor(client.color.green),
                ],
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [embed.setDescription("Đã xảy ra lỗi khi xóa playlist.").setColor(client.color.red)],
            });
        }
    },
);
