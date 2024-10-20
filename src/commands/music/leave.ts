import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "leave",
    {
        description: {
            content: "Rời khỏi kênh thoại",
            examples: ["leave"],
            usage: "leave",
        },
        aliases: ["l"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);

        if (!player) {
            const embed = new EmbedBuilder()
                .setColor(client.color.red)
                .setDescription("Tôi không có trong kênh thoại.");
            return await message.channel.send({ embeds: [embed] });
        }

        await player.destroy();
        return await message.react(client.emoji.done);
    },
);
