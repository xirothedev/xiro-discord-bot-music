import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import type { RepeatMode } from "lavalink-client";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";
export default prefix(
    "loop",
    {
        description: {
            content: "desc.loop",
            examples: ["loop", "loop queue", "loop song"],
            usage: "loop (queue | song)",
        },
        aliases: [],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: [
            "SendMessages",
            "ReadMessageHistory",
            "ViewChannel",
            "EmbedLinks",
        ],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color.main);
        const player = client.manager.getPlayer(message.guildId);

        const repeatModes = {
            off: {
                mode: "track",
                message: T(guild.language, "success.player.loop.track"),
            },
            track: {
                mode: "queue",
                message: T(guild.language, "success.player.loop.queue"),
            },
            queue: { mode: "off", message: T(guild.language, "success.player.loop.off") },
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
