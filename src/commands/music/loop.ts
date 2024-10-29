import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import type { RepeatMode } from "lavalink-client";
import { Category } from "@/typings/utils";

export default prefix(
    "loop",
    {
        description: {
            content: "Lặp lại bài hát hiện tại hoặc hàng chờ",
            examples: ["loop", "loop queue", "loop song"],
            usage: "loop (queue | song)",
        },
        aliases: [],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color.main);
        const player = client.manager.getPlayer(message.guildId);

        const repeatModes = {
            off: { mode: "track", message: "**Đang lặp lại bài hát.**" },
            track: { mode: "queue", message: "**Đang lặp lại hàng chờ.**" },
            queue: { mode: "off", message: "**Đã tắt chế độ lặp lại.**" },
        };

        const currentMode = player?.repeatMode;
        if (currentMode in repeatModes) {
            const { mode, message: description } = repeatModes[currentMode];
            await player.setRepeatMode(mode as RepeatMode);
            embed.setDescription(description);
        }

        return await message.channel.send({ embeds: [embed] });
    },
);
