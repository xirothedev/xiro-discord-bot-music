import prefix from "@/layouts/prefix";
import { Category } from "typings/utils";

export default prefix(
    "8d",
    {
        description: {
            content: "Bật/tắt bộ lọc 8d",
            examples: ["8d"],
            usage: "8d",
        },
        aliases: ["3d"],
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
        const filterEnabled = player.filterManager.filters.rotation;
        if (filterEnabled) {
            await player.filterManager.toggleRotation();
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc 8D đã được `BẬT`.",
                        color: client.color.main,
                    },
                ],
            });
        } else {
            await player.filterManager.toggleRotation(0.2);
            await message.channel.send({
                embeds: [
                    {
                        description: "`✅` | Bộ lọc 8D đã được `TẮT`.",
                        color: client.color.main,
                    },
                ],
            });
        }
    }
);
