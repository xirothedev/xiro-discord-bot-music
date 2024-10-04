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
        beta: true,
        aliases: ["come", "j"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
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

        player = client.manager.createPlayer({
            guildId: message.guildId,
            voiceChannelId: message.member?.voice.channelId!,
            textChannelId: message.channelId,
            selfMute: false,
            selfDeaf: true,
            vcRegion: message.member?.voice?.channel?.rtcRegion || "",
        });

        if (!player.connected) await player.connect();
        return await message.react(client.emoji.done);
    }
);
