import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "pitch",
    {
        description: {
            content: "desc.pitch",
            examples: ["pitch 1", "pitch 1.5", "pitch 1,5"],
            usage: "pitch [0.5 - 5.0]",
        },
        aliases: ["ph"],
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

        const pitchString = args[0].replace(",", ".");
        const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(pitchString);
        const pitch = Number.parseFloat(pitchString);

        if (!args[0] || !isValidNumber || Number.isNaN(pitch) || pitch < 0.5 || pitch > 5) {
            return await message.channel.send({
                embeds: [embed.setDescription(client.locale(guild, "error.pitch")).setColor(client.color.red)],
            });
        }

        await player?.filterManager.setPitch(pitch);
        return await message.react(client.emoji.done);
    },
);
