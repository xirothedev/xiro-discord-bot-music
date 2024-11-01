import checkPremium from "@/helpers/checkPremium";
import { PremiumErrorEmbedBuilder } from "@/interface/premium";
import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "create",
    {
        description: {
            content: "desc.create",
            examples: ["create KPop"],
            usage: "create [playlist]",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const name = args[0];

        if (!checkPremium(guild, user) && user.playlists.length >= 2) {
            return message.channel.send({
                embeds: [new PremiumErrorEmbedBuilder(client, guild, client.locale(guild, "error.premium.limit_playlists"))],
            });
        }

        if (!name) {
            return message.channel.send({
                embeds: [embed.setDescription(client.locale(guild, "error.no_playlist")).setColor(client.color.red)],
            });
        }

        if (name.length > 50) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(client.locale(guild, "error.create.limit_length")).setColor(client.color.red),
                ],
            });
        }

        const playlistExists = user.playlists.find((f) => f.name === name);

        if (playlistExists) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(client.locale(guild, "error.create.playlist_exist")),
                ],
            });
        }

        try {
            await client.prisma.playlist.create({ data: { name, userId: message.author.id } });
            return message.channel.send({
                embeds: [
                    embed.setDescription(client.locale(guild, "success.create", { name })).setColor(client.color.green),
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
