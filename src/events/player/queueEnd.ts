import event from "@/layouts/event";
import type { TextChannel } from "discord.js";
import type { Player, Track, TrackStartEvent } from "lavalink-client";

export default event(
    "queueEnd",
    { once: false },
    async (client, player: Player, track: Track | null, payload: TrackStartEvent) => {
        const guild = client.guilds.cache.get(player.guildId);
        if (!guild) return;

        const messageId = player.get<string | undefined>("messageId");
        if (!messageId) return;

        const channel = guild.channels.cache.get(player.textChannelId!) as TextChannel;
        if (!channel) return;

        const message = await channel.messages.fetch(messageId).catch(() => {
            null;
        });
        if (!message) return;

        if (message.editable) {
            await message.edit({ components: [] });
        }
    }
);
