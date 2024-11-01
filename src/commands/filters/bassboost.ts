import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { EQList } from "lavalink-client";
import { Category } from "@/typings/utils";

export default prefix(
    "bassboost",
    {
        description: {
            content: "desc.bassboost",
            examples: ["bassboost high", "bassboost medium", "bassboost low", "bassboost off"],
            usage: "bassboost [hight | medium | low | off]",
        },
        aliases: ["bb"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.filters,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const types = ["high", "medium", "low", "off"];

        if (!args[0] || !types.includes(args[0])) {
            const embed = new EmbedBuilder();

            return await message.channel.send({
                embeds: [
                    embed.setColor(client.color.red).setDescription(
                        client.locale(guild, "error.bassboost_type", {
                            type: types.join(", "),
                        }),
                    ),
                ],
            });
        }

        switch (args[0].toLowerCase()) {
            case "high": {
                await player?.filterManager.setEQ(EQList.BassboostHigh);
                return await message.react(client.emoji.done);
            }
            case "medium": {
                await player?.filterManager.setEQ(EQList.BassboostMedium);
                return await message.react(client.emoji.done);
            }
            case "low": {
                await player?.filterManager.setEQ(EQList.BassboostLow);
                return await message.react(client.emoji.done);
            }
            case "off": {
                await player?.filterManager.clearEQ();
                return await message.react(client.emoji.done);
            }
        }
    },
);
