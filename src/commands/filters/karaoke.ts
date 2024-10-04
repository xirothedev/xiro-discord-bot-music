import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "karaoke",
    {
        description: {
            content: "Bật/tắt bộ lọc karaoke",
            examples: ["karaoke"],
            usage: "karaoke",
        },
        aliases: ["kk"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.filters,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();
        const filterEnabled = player.filterManager.filters.karaoke;

        if (filterEnabled) {
            await player.filterManager.toggleKaraoke();
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Karaoke đã được `TẮT`.").setColor(client.color.main)],
            });
        } else {
            await player.filterManager.toggleKaraoke();
            await message.channel.send({
                embeds: [embed.setDescription("`✅` | Bộ lọc Karaoke đã được `BẬT`.").setColor(client.color.main)],
            });
        }
    }
);
