import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "lowpass",
    {
        description: {
            content: "Bật/tắt bộ lọc lowpass",
            examples: ["lowpass"],
            usage: "lowpass",
        },
        aliases: ["lp"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.filters,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const filterEnabled = player?.filterManager.filters.lowPass;
        const embed = new EmbedBuilder();

        if (filterEnabled) {
            await player?.filterManager.toggleLowPass();
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Lowpass đã được `TẮT`.").setColor(client.color.main)],
            });
        } else {
            await player?.filterManager.toggleLowPass(20);
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Lowpass đã được `BẬT`.").setColor(client.color.main)],
            });
        }
    },
);
