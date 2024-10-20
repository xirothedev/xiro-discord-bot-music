import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "vibrato",
    {
        description: {
            content: "Bật/tắt bộ lọc vibrato",
            examples: ["vibrato"],
            usage: "vibrato",
        },
        aliases: ["vb"],
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
        const vibratoEnabled = player?.filterManager.filters.vibrato;

        if (vibratoEnabled) {
            player?.filterManager.toggleVibrato();
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Vibrato đã được `TẮT`.").setColor(client.color.main)],
            });
        } else {
            player?.filterManager.toggleVibrato();
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Vibrato đã được `BẬT`.").setColor(client.color.main)],
            });
        }
    },
);
