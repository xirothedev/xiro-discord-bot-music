import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "rotation",
    {
        description: {
            content: "Bật/tắt bộ lọc rotation",
            examples: ["rotation"],
            usage: "rotation",
        },
        aliases: [],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.filters,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (player?.filterManager.filters.rotation) {
            player?.filterManager.toggleRotation();
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Rotation đã được `TẮT`.").setColor(client.color.main)],
            });
        } else {
            player?.filterManager.toggleRotation();
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Rotation đã được `BẬT`.").setColor(client.color.main)],
            });
        }
    },
);
