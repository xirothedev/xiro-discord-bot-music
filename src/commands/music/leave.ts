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
        beta: true,
        aliases: ["l"],
        cooldown: "5s",
        voiceOnly: true,
        ownRoom: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (player) {
            await player.destroy();
            return await message.react(client.emoji.done);
        }

        return await message.channel.send({
            embeds: [embed.setColor(client.color.red).setDescription("Tôi không có trong kênh thoại.")],
        });
    }
);
