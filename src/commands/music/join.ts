import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "join",
    {
        description: {
            content: "Tham gia kênh thoại.",
            examples: ["join"],
            usage: "join",
        },
        aliases: ["come", "j"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message) => {
        const embed = new EmbedBuilder();
        let player = client.manager.getPlayer(message.guildId);

        if (player) {
            embed.setColor(client.color.main).setDescription(`Tôi đã kết nối với <#${player.voiceChannelId}> rồi!`);
            return await message.channel.send({ embeds: [embed] });
        }

        player = client.manager.createPlayer({
            guildId: message.guildId,
            voiceChannelId: message.member?.voice.channelId!,
            textChannelId: message.channelId,
            selfMute: false,
            selfDeaf: true,
            vcRegion: message.member?.voice.channel?.rtcRegion || "",
        });

        if (!player.connected) await player.connect();

        return await message.react(client.emoji.done);
    },
);
