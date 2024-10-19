import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "remove",
    {
        description: {
            content: "Xóa một bài hát khỏi hàng chờ",
            examples: ["remove 1"],
            usage: "remove <song number>",
        },
        aliases: ["rm"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder().setColor(client.color.red);

        if (player.queue.tracks.length === 0)
            return await message.channel.send({
                embeds: [embed.setDescription("Không có bài hát nào trong hàng chờ.")],
            });

        const songNumber = Number(args[0]);
        if (isNaN(songNumber) || songNumber <= 0 || songNumber > player.queue.tracks.length)
            return await message.channel.send({
                embeds: [embed.setDescription("Vui lòng cung cấp một số hợp lệ.")],
            });

        await player.queue.remove(songNumber - 1);
        return await message.react(client.emoji.done);
    },
);
