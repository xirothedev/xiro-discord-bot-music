import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import type { TrackData } from "@/typings";
import { Category } from "@/typings/utils";

export default prefix(
    "add",
    {
        description: {
            content: "desc.add",
            examples: ["add KPop Nơi này có anh"],
            usage: "add [tên playlist] [bài hát]",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const playlistName = args.shift();
        const embed = new EmbedBuilder();
        const songQuery = args.join(" ");

        if (!playlistName) {
            return message.channel.send({
                embeds: [embed.setDescription(client.locale(guild, "error.no_playlist")).setColor(client.color.red)],
            });
        }

        if (!songQuery) {
            return message.channel.send({
                embeds: [embed.setDescription(client.locale(guild, "error.no_track")).setColor(client.color.red)],
            });
        }

        try {
            const searchResult = await client.manager.search(songQuery, message.author);
            if (!searchResult || searchResult.tracks.length === 0) {
                return message.channel.send({
                    embeds: [embed.setColor(client.color.red).setDescription(client.locale(guild, "error.no_result"))],
                });
            }

            const playlistData = user.playlists.find((f) => f.name === playlistName);

            if (!playlistData) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setDescription(client.locale(guild, "error.playlist_not_found"))
                            .setColor(client.color.red),
                    ],
                });
            }

            const trackDataArray: TrackData[] = [];
            let trackCount = 0;

            if (searchResult.loadType === "playlist") {
                searchResult.tracks.forEach((track) => {
                    if (track.encoded) {
                        trackDataArray.push({
                            name: track.info.title,
                            uri: track.info.uri,
                            encode: track.encoded,
                            duration: track.info.duration,
                        });
                        trackCount++;
                    }
                });
            } else if (searchResult.loadType === "track" || searchResult.loadType === "search") {
                if (searchResult.tracks[0].encoded) {
                    trackDataArray.push({
                        name: searchResult.tracks[0].info.title,
                        uri: searchResult.tracks[0].info.uri,
                        encode: searchResult.tracks[0].encoded,
                        duration: searchResult.tracks[0].info.duration,
                    });
                    trackCount = 1;
                }
            }

            await Promise.all(
                trackDataArray.map((trackData) => client.utils.addTracksToPlaylist(playlistData, trackData)),
            );

            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            client.locale(guild, "success.add", {
                                number: trackCount,
                                playlist: playlistName,
                            }),
                        )
                        .setColor(client.color.green),
                ],
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [embed.setDescription(client.locale(guild, "error.error")).setColor(client.color.red)],
            });
        }
    },
);
