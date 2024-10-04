import event from "@/layouts/event";
import { ChannelType, type VoiceState } from "discord.js";

export default event(
    "voiceStateUpdate",
    { once: false },
    async (client, oldState: VoiceState, newState: VoiceState) => {
        const player = client.manager.getPlayer(newState.guild.id);
        if (!player || !player.voiceChannelId) return;

        if (
            newState.channel?.members.size &&
            newState.channel.members.size <= 1 &&
            newState.channel?.members.has(client.user.id)
        ) {
            await player.destroy();
        }
    }
);
