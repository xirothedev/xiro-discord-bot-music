import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "speed",
    {
        description: {
            content: "desc.speed",
            examples: ["speed 1", "speed 1.5", "speed 1,5"],
            usage: "speed [number]",
        },
        aliases: ["rate"],
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
        const rateString = args[0].replace(",", ".");
        const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(rateString);
        const rate = Number.parseFloat(rateString);

        if (!isValidNumber || Number.isNaN(rate) || rate < 0.5 || rate > 5) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(T(guild.language, "error.speed"))
                        .setColor(client.color.red),
                ],
            });
        }

        await player?.filterManager.setRate(rate);
        return await message.react(client.emoji.done);
    },
);
