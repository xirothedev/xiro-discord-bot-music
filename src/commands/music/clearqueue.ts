import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "clearqueue",
    {
        description: {
            content: "Xóa hàng chờ",
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
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Không có player hoạt động trong server.")],
            });
        }

        if (player.queue.tracks.length === 0) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Không có bài hát nào trong danh sách phát.")],
            });
        }

        player.queue.tracks.splice(0, player.queue.tracks.length);
        return await message.react(client.emoji.done);
    },
);
