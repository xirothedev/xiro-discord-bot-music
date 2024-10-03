import { createButtonRow } from "@/functions/createButtonRow";
import createCollector from "@/functions/createCollector";
import event from "@/layouts/event";
import { EmbedBuilder, type TextChannel } from "discord.js";
import type { Player, Track, TrackStartEvent } from "lavalink-client";

export default event(
    "trackStart",
    { once: false },
    async (client, player: Player, track: Track | null, payload: TrackStartEvent) => {
        const guild = client.guilds.cache.get(player.guildId);
        if (!guild) return;
        if (!player.textChannelId) return;
        if (!track) return;
        const channel = guild.channels.cache.get(player.textChannelId) as TextChannel;
        if (!channel) return;

        client.utils.updateStatus(client, guild.id);

        await client.prisma.room.upsert({
            where: { roomId: channel.id },
            create: { roomId: channel.id, ownerId: (track.requester as Requester).id },
            update: {},
        });

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Đang phát",
                iconURL: client.icons[track.info.sourceName] ?? client.user?.displayAvatarURL({ extension: "png" }),
            })
            .setColor(client.color.main)
            .setDescription(`**[${track.info.title}](${track.info.uri})**`)
            .setFooter({
                text: `Yêu cầu bởi ${(track.requester as Requester).username}`,
                iconURL: (track.requester as Requester).avatarURL,
            })
            .setThumbnail(track.info.artworkUrl)
            .addFields(
                {
                    name: "Thời gian",
                    value: track.info.isStream ? "LIVE" : client.utils.formatTime(track.info.duration),
                    inline: true,
                },
                {
                    name: "Tác giả",
                    value: track.info.author,
                    inline: true,
                }
            )
            .setTimestamp();

        const message = await channel.send({
            embeds: [embed],
            components: [createButtonRow(player, client)],
        });

        player.set("messageId", message.id);
        createCollector(message, player, track, embed, client);
    }
);
