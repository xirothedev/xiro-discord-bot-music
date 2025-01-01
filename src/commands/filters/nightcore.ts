import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";
export default prefix(
    "nightcore",
    {
        description: {
            content: "desc.nightcore",
            examples: ["nightcore"],
            usage: "nightcore",
        },
        aliases: ["nc"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: [
            "SendMessages",
            "ReadMessageHistory",
            "ViewChannel",
            "EmbedLinks",
        ],
        ignore: false,
        category: Category.filters,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();
        const filterEnabled = player?.filterManager.filters.nightcore;

        if (filterEnabled) {
            await player?.filterManager.toggleNightcore();
            await message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "success.filters.nightcore_off"))
                        .setColor(client.color.main),
                ],
            });
        } else {
            await player?.filterManager.toggleNightcore();
            await message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "success.filters.nightcore_on"))
                        .setColor(client.color.main),
                ],
            });
        }
    },
);
