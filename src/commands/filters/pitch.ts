import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "pitch",
    {
        description: {
            content: "Bật/tắt bộ lọc pitch",
            examples: ["pitch 1", "pitch 1.5", "pitch 1,5"],
            usage: "pitch <number>",
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

        if (!args[0]) {
            return await message.channel.send({
                embeds: [
                    embed.setDescription("Vui lòng cung cấp một số hợp lệ giữa 0.5 và 5.0").setColor(client.color.red),
                ],
            });
        }
        const pitchString = args[0].replace(",", ".");
        const isValidNumber = /^[0-9]*\.?[0-9]+$/.test(pitchString);
        const pitch = Number.parseFloat(pitchString);

        if (!isValidNumber || Number.isNaN(pitch) || pitch < 0.5 || pitch > 5) {
            return await message.channel.send({
                embeds: [
                    embed.setDescription("Vui lòng cung cấp một số hợp lệ giữa 0.5 và 5.0").setColor(client.color.red),
                ],
            });
        }

        await player?.filterManager.setPitch(pitch);
        return await message.react(client.emoji.done);
    },
);
