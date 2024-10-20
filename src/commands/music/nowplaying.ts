import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import type { Requester } from "typings/player";
import { Category } from "typings/utils";

export default prefix(
    "nowplaying",
    {
        description: {
            content: "Hiển thị bài hát đang phát hiện tại",
            examples: ["nowplaying"],
            usage: "nowplaying",
        },
        aliases: ["np"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const track = player.queue.current;

        const embed = new EmbedBuilder().setColor(client.color.main);

        if (!track) {
            embed.setColor(client.color.red).setDescription("Hiện tại không có gì đang phát.");
            return await message.channel.send({ embeds: [embed] });
        }

        const position = player.position;
        const duration = track.info.duration;
        const bar = client.utils.progressBar(position, duration, 20);
        const requesterId = (track.requester as Requester).id;

        embed
            .setAuthor({
                name: "Đang phát",
                iconURL: message.guild.iconURL()!,
            })
            .setThumbnail(track.info.artworkUrl)
            .setDescription(`[${track.info.title}](${track.info.uri}) - Yêu cầu bởi: <@${requesterId}>\n\n\`${bar}\``)
            .addFields({
                name: "\u200b",
                value: `\`${client.utils.formatTime(position)} / ${client.utils.formatTime(duration)}\``,
            });

        return await message.channel.send({ embeds: [embed] });
    },
);
