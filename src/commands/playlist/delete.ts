import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "delete",
    {
        description: {
            content: "desc.delete",
            examples: ["delete KPop"],
            usage: "delete [tên playlist]",
        },
        aliases: ["del"],
        cooldown: "5s",
        botPermissions: [
            "SendMessages",
            "ReadMessageHistory",
            "ViewChannel",
            "EmbedLinks",
        ],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const playlistName = args[0];

        if (!playlistName) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "error.playlist.no_playlist"))
                        .setColor(client.color.red),
                ],
            });
        }

        const playlistExists = user.playlists.find((f) => f.name === playlistName);

        if (!playlistExists) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            T(guild.language, "error.playlist.playlist_not_found"),
                        )
                        .setColor(client.color.red),
                ],
            });
        }

        try {
            await client.prisma.playlist.delete({
                where: { playlist_id: playlistExists.playlist_id },
            });

            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            T(guild.language, "success.delete", {
                                name: playlistName,
                            }),
                        )
                        .setColor(client.color.green),
                ],
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "error.common.error"))
                        .setColor(client.color.red),
                ],
            });
        }
    },
);
