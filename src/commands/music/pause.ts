import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "pause",
    {
        description: {
            content: "Tạm dừng bài hát hiện tại",
            examples: ["pause"],
            usage: "pause",
        },
        aliases: [],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (player.paused) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Bài hát đã được tạm dừng rồi.")],
            });
        }

        await player.pause();

        return await message.react(client.emoji.done);
    }
);
