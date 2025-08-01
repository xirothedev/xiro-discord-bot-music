import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "volume",
    {
        description: {
            content: ".",
            examples: ["volume 100"],
            usage: "volume [0 - 200]",
        },
        aliases: ["v", "vol"],
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
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const number = Number(args[0]);

        if (Number.isNaN(number) || number < 0 || number > 200) {
            let description = "";
            if (Number.isNaN(number)) {
                description = T(guild.language, "error.common.invalid_number");
            } else if (number < 0) {
                description = T(guild.language, "error.volume.minium");
            } else if (number > 200) {
                description = T(guild.language, "error.volume.maxium");
            }

            return await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color.red)
                        .setDescription(description),
                ],
            });
        }

        await player.setVolume(number);

        return await message.react(client.emoji.done);
    },
);
