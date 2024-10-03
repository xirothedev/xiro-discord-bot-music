import prefix from "@/layouts/prefix";
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
        ownRoom: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.filters,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const vibratoEnabled = player.filterManager.filters.vibrato;

        if (vibratoEnabled) {
            player.filterManager.toggleVibrato();
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc Vibrato đã được `TẮT`.",
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.filterManager.toggleVibrato();
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc Vibrato đã được `BẬT`.",
                        color: client.color.main,
                    },
                ],
            });
        }
    }
);
