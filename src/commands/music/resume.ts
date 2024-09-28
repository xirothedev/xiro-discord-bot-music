import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "resume",
    {
        description: {
            content: "Tiếp tục phát bài hát hiện tại",
            examples: ["resume"],
            usage: "resume",
        },
        aliases: ["r", "continue"],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player.paused) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Trình phát không bị tạm dừng.")],
            });
        }

        await player.resume();
        return await message.react(client.emoji.done);
    }
);
