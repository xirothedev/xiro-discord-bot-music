import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "rate",
    {
        description: {
            content: "Thay đổi tốc độ của bài hát",
            examples: ["rate 1", "rate 1.5", "rate 1,5"],
            usage: "rate <number>",
        },
        aliases: ["rt", "speed"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.filters,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const rateString = args[0].replace(",", ".");
        const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(rateString);
        const rate = Number.parseFloat(rateString);

        if (!isValidNumber || Number.isNaN(rate) || rate < 0.5 || rate > 5) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Vui lòng cung cấp một số hợp lệ giữa 0.5 và 5.")
                        .setColor(client.color.red),
                ],
            });
        }

        await player?.filterManager.setRate(rate);
        return await message.react(client.emoji.done);
    }
);
