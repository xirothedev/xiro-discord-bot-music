import checkPremium from "@/helpers/checkPremium";
import resolveUserId from "@/helpers/resolveUserId";
import { PremiumErrorEmbedBuilder } from "@/interface/premium";
import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "steal",
    {
        description: {
            content: "desc.streal",
            examples: ["steal @Shiroko KPop", "steal @Shiroko EDM music-edm"],
            usage: "steal [user] [playlist] (name)",
        },
        aliases: ["st"],
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const targetUserArg = args[0];
        const playlistName = args[1];
        const playlistRename = args[2] || playlistName;

        if (!checkPremium(guild, user) && user.playlists.length >= 2) {
            return message.channel.send({
                embeds: [new PremiumErrorEmbedBuilder(client, guild, client.locale(guild, "error.premium.limit_playlists"))],
            });
        }

        const userId = await resolveUserId(client, targetUserArg, message);
        if (!userId) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription(client.locale(guild, "error.invalid_user"))],
            });
        }

        if (!playlistName) {
            return message.channel.send({
                embeds: [embed.setDescription(client.locale(guild, "error.no_playlist")).setColor(client.color.red)],
            });
        }

        try {
            const playlistData = await client.prisma.playlist.findUnique({
                where: { userId_name: { userId, name: playlistName } },
                include: { tracks: true },
            });

            if (!playlistData) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setDescription(client.locale(guild, "error.playlist_not_found"))
                            .setColor(client.color.red),
                    ],
                });
            }

            const existingPlaylist = user.playlists.find((f) => f.name === playlistRename);

            if (existingPlaylist) {
                return message.channel.send({
                    embeds: [
                        embed.setDescription(client.locale(guild, "error.exist_playlist")).setColor(client.color.red),
                    ],
                });
            }

            await client.prisma.playlist.create({
                data: {
                    name: playlistRename,
                    userId: message.author.id,
                    tracks: { createMany: { data: playlistData.tracks, skipDuplicates: true } },
                },
            });

            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            client.locale(guild, "succcess.steal", {
                                playlist: playlistName,
                                userId,
                            }),
                        )
                        .setColor(client.color.main),
                ],
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription(client.locale(guild, "error.error"))],
            });
        }
    },
);
