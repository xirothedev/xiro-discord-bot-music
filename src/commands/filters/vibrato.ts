import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "vibrato",
    {
        description: {
            content: "desc.vibrato",
            examples: ["vibrato"],
            usage: "vibrato",
        },
        aliases: ["vb"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.filters,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();
        const vibratoEnabled = player?.filterManager.filters.vibrato;

        if (vibratoEnabled) {
            player?.filterManager.toggleVibrato();
            await message.channel.send({
                embeds: [embed.setDescription(client.locale(guild, "success.vibrato_off")).setColor(client.color.main)],
            });
        } else {
            player?.filterManager.toggleVibrato();
            await message.channel.send({
                embeds: [embed.setDescription(client.locale(guild, "success.vibrato_on")).setColor(client.color.main)],
            });
        }
    },
);
