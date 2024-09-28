import prefix from "@/layouts/prefix";
import { EmbedBuilder, VoiceChannel } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "join",
    {
        description: {
            content: "Tham gia kênh thoại",
            examples: ["join"],
            usage: "join",
        },
        aliases: ["come", "j"],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const embed = new EmbedBuilder();
        let player = client.manager.getPlayer(message.guildId);

        if (player) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.main)
                        .setDescription(`Tôi đã kết nối với <#${player.voiceChannelId}> rồi!`),
                ],
            });
        }

        const memberVoiceChannel = message.member?.voice.channel as VoiceChannel;
        if (!memberVoiceChannel) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription("Bạn cần phải ở trong một kênh thoại để sử dụng lệnh này."),
                ],
            });
        }

        player = client.manager.createPlayer({
            guildId: message.guildId,
            voiceChannelId: memberVoiceChannel.id,
            textChannelId: message.channelId,
            selfMute: false,
            selfDeaf: true,
            vcRegion: memberVoiceChannel.rtcRegion || "",
        });
        
        if (!player.connected) await player.connect();
        return await message.react(client.emoji.done);
    }
);
