import { createButtonRow } from "@/functions/createButtonRow";
import createCollector from "@/functions/createCollector";
import event from "@/layouts/event";
import { EmbedBuilder, type TextChannel } from "discord.js";
import type { Player, Track, TrackStartEvent } from "lavalink-client";
import type { Requester } from "@/typings/player";
import { T } from "@/handlers/i18n";

export default event(
    "trackStart",
    { once: false },
    async (client, player: Player, track: Track | null, payload: TrackStartEvent) => {
        const guild = client.guilds.cache.get(player.guildId);
        if (!guild || !player.textChannelId || !track) return;
        const channel = guild.channels.cache.get(player.textChannelId) as TextChannel;
        if (!channel) return;

        const embed = new EmbedBuilder();

        client.utils.updateStatus(client, guild.id);

        const data = await client.prisma.guild.upsert({
            where: { guildId: guild.id },
            create: { guildId: guild.id },
            update: {},
        });

        const requester = track.requester as Requester;

        embed
            .setAuthor({
                name: T(data.language, "use_many.player.playing"),
                iconURL:
                    client.icons[track.info.sourceName] ??
                    client.user?.displayAvatarURL({ extension: "png" }),
            })
            .setColor(client.color.main)
            .setDescription(`**[${track.info.title}](${track.info.uri})**`)
            .setFooter({
                text: `${T(data.language, "use_many.request_by")} ${requester.username}`,
                iconURL: requester.avatarURL,
            })
            .setThumbnail(track.info.artworkUrl)
            .addFields(
                {
                    name: T(data.language, "use_many.duration"),
                    value: track.info.isStream
                        ? "LIVE"
                        : client.utils.formatTime(track.info.duration),
                    inline: true,
                },
                {
                    name: T(data.language, "use_many.author"),
                    value: track.info.author,
                    inline: true,
                },
            )
            .setTimestamp();

        const message = await channel.send({
            embeds: [embed],
            components: createButtonRow(player, client),
        });

        player.set("messageId", message.id);
        createCollector(message, player, track, embed, client);
    },
);
