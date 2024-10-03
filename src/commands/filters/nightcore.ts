import prefix from "@/layouts/prefix";
import { Category } from "typings/utils";

export default prefix(
    "nightcore",
    {
        description: {
            content: "Bật/tắt bộ lọc nightcore",
            examples: ["nightcore"],
            usage: "nightcore",
        },
        aliases: ["nc"],
        cooldown: "5s",
        voiceOnly: true,
        ownRoom: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.filters,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const filterEnabled = player.filterManager.filters.nightcore;

        if (filterEnabled) {
            await player.filterManager.toggleNightcore();
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc Nightcore đã được `TẮT`.",
                        color: client.color.main,
                    },
                ],
            });
        } else {
            await player.filterManager.toggleNightcore();
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc Nightcore đã được `BẬT`.",
                        color: client.color.main,
                    },
                ],
            });
        }
    }
);
