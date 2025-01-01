import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "karaoke",
    {
        description: {
            content: "desc.karaoke",
            examples: ["karaoke"],
            usage: "karaoke",
        },
        aliases: ["kk"],
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
        const filterEnabled = player?.filterManager.filters.karaoke;

        if (filterEnabled) {
            await player?.filterManager.toggleKaraoke();
            await message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "success.filters.karaoke_off"))
                        .setColor(client.color.main),
                ],
            });
        } else {
            await player?.filterManager.toggleKaraoke();
            await message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "success.filters.karaoke_on"))
                        .setColor(client.color.main),
                ],
            });
        }
    },
);
