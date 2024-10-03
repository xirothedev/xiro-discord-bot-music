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
            await client.prisma.room.delete({ where: { roomId: player.voiceChannelId } });
        }

        if (oldState.channelId && !newState.channelId) {
            await client.prisma.room.upsert({
                where: { roomId: player.voiceChannelId },
                create: { roomId: player.voiceChannelId },
                update: { ownerId: null },
            });
        }

        // const vc = newState.guild.channels.cache.get(player.voiceChannelId);
        // if (!(vc && vc.members instanceof Map)) return;

        // if (
        //     newState.id === client.user.id &&
        //     newState.channelId &&
        //     newState.channel?.type === ChannelType.GuildStageVoice &&
        //     newState.guild.members.me?.voice.suppress
        // ) {
        //     if (
        //         newState.guild.members.me.permissions.has(["Connect", "Speak"]) ||
        //         newState.channel.permissionsFor(newState.guild.members.me).has("MuteMembers")
        //     ) {
        //         await newState.guild.members.me.voice.setSuppressed(false);
        //     }
        // }

        // if (newState.id === client.user?.id && !newState.serverDeaf) {
        //     const permissions = vc.permissionsFor(newState.guild.members.me!);
        //     if (permissions?.has("DeafenMembers")) {
        //         await newState.setDeaf(true);
        //     }
        // }

        // if (newState.id === client.user?.id) {
        //     if (newState.serverMute && !player.paused) {
        //         player.pause();
        //     } else if (!newState.serverMute && player.paused) {
        //         player.pause();
        //     }
        // }
    }
);
