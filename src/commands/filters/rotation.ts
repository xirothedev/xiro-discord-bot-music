import prefix from "@/layouts/prefix";
import { Category } from "typings/utils";

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
        ownRoom: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.filters,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        if (player.filterManager.filters.rotation) {
            player.filterManager.toggleRotation();
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc Rotation đã được `TẮT`.",
                        color: client.color.main,
                    },
                ],
            });
        } else {
            player.filterManager.toggleRotation();
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc Rotation đã được `BẬT`.",
                        color: client.color.main,
                    },
                ],
            });
        }
    }
);
