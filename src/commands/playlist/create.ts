import checkPremium from "@/helpers/checkPremium";
import { PremiumErrorEmbedBuilder } from "@/interface/premium";
import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "create",
    {
        description: {
            content: "Tạo playlist.",
            examples: ["create KPop"],
            usage: "create [tên playlist]",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const name = args[0];

        if (!checkPremium(guild, user) && user.playlists.length >= 2) {
            return message.channel.send({
                embeds: [new PremiumErrorEmbedBuilder(client, "Bạn không thể tạo nhiều hơn 2 playlists")],
            });
        }

        if (!name) {
            return message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp tên playlist.").setColor(client.color.red)],
            });
        }

        if (name.length > 50) {
            return message.channel.send({
                embeds: [embed.setDescription("Tên playlist không được vượt quá 50 ký tự.").setColor(client.color.red)],
            });
        }

        const playlistExists = user.playlists.find((f) => f.name === name);

        if (playlistExists) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Playlist đã tồn tại.")],
            });
        }

        try {
            await client.prisma.playlist.create({ data: { name, userId: message.author.id } });
            return message.channel.send({
                embeds: [embed.setDescription(`Danh sách phát **${name}** đã được tạo.`).setColor(client.color.green)],
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [embed.setDescription("Đã xảy ra lỗi khi tạo playlist.").setColor(client.color.red)],
            });
        }
    },
);
