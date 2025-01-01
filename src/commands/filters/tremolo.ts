import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";
export default prefix(
    "tremolo",
    {
        description: {
            content: "desc.tremolo",
            examples: ["tremolo"],
            usage: "tremolo",
        },
        aliases: ["tr"],
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
        const tremoloEnabled = player?.filterManager.filters.tremolo;

        if (tremoloEnabled) {
            player?.filterManager.toggleTremolo();
            await message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "success.filters.tremolo_off"))
                        .setColor(client.color.main),
                ],
            });
        } else {
            player?.filterManager.toggleTremolo();
            await message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "success.filters.tremolo_on"))
                        .setColor(client.color.main),
                ],
            });
        }
    },
);
