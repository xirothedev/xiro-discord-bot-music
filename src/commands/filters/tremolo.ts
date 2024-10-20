import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "tremolo",
    {
        description: {
            content: "Bật/tắt bộ lọc tremolo",
            examples: ["tremolo"],
            usage: "tremolo",
        },
        aliases: ["tr"],
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
        const tremoloEnabled = player?.filterManager.filters.tremolo;

        if (tremoloEnabled) {
            player?.filterManager.toggleTremolo();
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Tremolo đã được `TẮT`.").setColor(client.color.main)],
            });
        } else {
            player?.filterManager.toggleTremolo();
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Tremolo đã được `BẬT`.").setColor(client.color.main)],
            });
        }
    },
);
