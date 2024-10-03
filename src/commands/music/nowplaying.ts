import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "nowplaying",
    {
        description: {
            content: "Hiển thị bài hát đang phát hiện tại",
            examples: ["nowplaying"],
            usage: "nowplaying",
        },
        beta: true,
        aliases: ["np"],
        cooldown: "5s",
        voiceOnly: true,
        ownRoom: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const track = player.queue.current;
        const position = player.position;

        const embed = new EmbedBuilder();

        if (!track) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Hiện tại không có gì đang phát.")],
            });
        }

        const duration = track.info.duration;
        const bar = client.utils.progressBar(position, duration, 20);

        embed
            .setColor(client.color.main)
            .setAuthor({
                name: "Đang phát",
                iconURL: message.guild.iconURL()!,
            })
            .setThumbnail(track.info.artworkUrl)
            .setDescription(
                `[${track.info.title}](${track.info.uri}) - Yêu cầu bởi: <@${
                    (track.requester as Requester).id
                }>\n\n\`${bar}\``
            )
            .addFields({
                name: "\u200b",
                value: `\`${client.utils.formatTime(position)} / ${client.utils.formatTime(duration)}\``,
            });

        return await message.channel.send({ embeds: [embed] });
    }
);
