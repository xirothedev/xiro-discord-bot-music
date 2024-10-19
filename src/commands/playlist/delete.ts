import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "delete",
    {
        description: {
            content: "Xóa playlist.",
            examples: ["delete KPop"],
            usage: "delete <tên playlist>",
        },
        aliases: ["del"],
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, message, args) => {
        const playlistName = args[0];
        const embed = new EmbedBuilder();

        const playlistExists = await client.prisma.playlist.findUnique({
            where: { userId_name: { name: playlistName, userId: message.author.id } },
        });

        if (!playlistExists) {
            return await message.channel.send({
                embeds: [embed.setDescription("Playlist không tồn tại").setColor(client.color.red)],
            });
        }

        // First, delete all songs from the playlist
        await client.prisma.playlist.delete({
            where: { userId_name: { name: playlistExists.name, userId: playlistExists.userId } },
        });

        return await message.channel.send({
            embeds: [embed.setDescription(`Đã xóa danh sách phát **${playlistName}**.`).setColor(client.color.green)],
        });
    },
);
