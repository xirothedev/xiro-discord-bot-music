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
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);

        if (player.paused) {
            const embed = new EmbedBuilder().setColor(client.color.red).setDescription("Bài hát đã được tạm dừng rồi.");
            return await message.channel.send({ embeds: [embed] });
        }

        await player.pause();
        return await message.react(client.emoji.done);
    },
);
