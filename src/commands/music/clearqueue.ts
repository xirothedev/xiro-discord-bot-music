import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "clearqueue",
    {
        description: {
            content: "Xóa hàng chờ.",
            examples: ["clearqueue"],
            usage: "clearqueue",
        },
        aliases: ["cq"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player) {
            embed.setColor(client.color.red).setDescription("Không có player hoạt động trong server.");
            return await message.channel.send({ embeds: [embed] });
        }

        if (player.queue.tracks.length === 0) {
            embed.setColor(client.color.red).setDescription("Không có bài hát nào trong danh sách phát.");
            return await message.channel.send({ embeds: [embed] });
        }

        player.queue.tracks.splice(0, player.queue.tracks.length);

        await message.react(client.emoji.done);
    },
);
