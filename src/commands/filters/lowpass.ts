import prefix from "@/layouts/prefix";
import { Category } from "typings/utils";

export default prefix(
    "lowpass",
    {
        description: {
            content: "Bật/tắt bộ lọc lowpass",
            examples: ["lowpass"],
            usage: "lowpass <number>",
        },
        aliases: ["lp"],
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
        const filterEnabled = player.filterManager.filters.lowPass;

        if (filterEnabled) {
            await player.filterManager.toggleLowPass();
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc Lowpass đã được `TẮT`.",
                        color: client.color.main,
                    },
                ],
            });
        } else {
            await player.filterManager.toggleLowPass(20);
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc Lowpass đã được `BẬT`.",
                        color: client.color.main,
                    },
                ],
            });
        }
    }
);
