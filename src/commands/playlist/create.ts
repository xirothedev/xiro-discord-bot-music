import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "create",
    {
        description: {
            content: "Tạo playlist.",
            examples: ["create KPop"],
            usage: "create <tên playlist>",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, message, args) => {
        const embed = new EmbedBuilder();
        const name = args[0];

        if (!name) {
            return await message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp tên playlist").setColor(client.color.red)],
            });
        }

        if (name.length > 50) {
            return await message.channel.send({
                embeds: [embed.setDescription("Tên playlist quá dài").setColor(client.color.red)],
            });
        }

        const playlistExists = await client.prisma.playlist.findUnique({
            where: { userId_name: { name, userId: message.author.id } },
        });
        if (playlistExists) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Playlist đã tồn tại.")],
            });
        }

        await client.prisma.playlist.create({ data: { name, userId: message.author.id } });
        return await message.channel.send({
            embeds: [embed.setDescription(`Danh sách phát **${name}** đã được tạo`).setColor(client.color.green)],
        });
    },
);
