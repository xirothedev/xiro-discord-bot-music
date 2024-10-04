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
        beta: true,
        aliases: ["r", "continue"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);

        if (!player.paused) {
            return await message.channel.send({
                embeds: [new EmbedBuilder().setColor(client.color.red).setDescription("Trình phát không bị tạm dừng.")],
            });
        }

        await player.resume();
        return await message.react(client.emoji.done);
    }
);
