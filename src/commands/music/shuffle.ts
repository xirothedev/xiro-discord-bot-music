import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "shuffle",
    {
        description: {
            content: "Trộn hàng chờ",
            examples: ["shuffle"],
            usage: "shuffle",
        },
        beta: true,
        aliases: ["sh"],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();
        if (player.queue.tracks.length === 0) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Không có bài hát nào trong danh sách phát.")],
            });
        }
        await player.queue.shuffle();
        return await message.react(client.emoji.done);
    }
);
