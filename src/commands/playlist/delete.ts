import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

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
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const playlistName = args[0];

        if (!playlistName) {
            return message.channel.send({
                embeds: [embed.setDescription(client.locale(guild, "error.no_playlist")).setColor(client.color.red)],
            });
        }

        const playlistExists = user.playlists.find((f) => f.name === playlistName);

        if (!playlistExists) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(client.locale(guild, "error.playlist_not_found")).setColor(client.color.red),
                ],
            });
        }

        try {
            await client.prisma.playlist.delete({ where: { playlist_id: playlistExists.playlist_id } });

            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(client.locale(guild, "success.create", { name: playlistName }))
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
