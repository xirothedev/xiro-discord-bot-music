import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "join",
    {
        description: {
            content: "desc.join",
            examples: ["join"],
            usage: "join",
        },
        aliases: ["come", "j"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: [
            "SendMessages",
            "ReadMessageHistory",
            "ViewChannel",
            "EmbedLinks",
            "Connect",
            "Speak",
        ],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message) => {
        const embed = new EmbedBuilder();
        let player = client.manager.getPlayer(message.guildId);

        if (player) {
            embed.setColor(client.color.main).setDescription(
                T(guild.language, "error.voice.connected", {
                    voiceChannelId: player.voiceChannelId,
                }),
            );
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
