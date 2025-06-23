import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "remove",
    {
        description: {
            content: "desc.remove",
            examples: ["remove 1"],
            usage: "remove [index]",
        },
        aliases: ["rm"],
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
        const embed = new EmbedBuilder().setColor(client.color.red);

        if (!player || player.queue.tracks.length === 0) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        T(guild.language, "error.player.no_track_in_queue"),
                    ),
                ],
            });
        }

        const songNumber = Number(args[0]);
        if (
            !Number.isInteger(songNumber) ||
            songNumber <= 0 ||
            songNumber > player.queue.tracks.length
        ) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        T(guild.language, "error.common.invalid_number"),
                    ),
                ],
            });
        }

        await player.queue.remove(songNumber - 1);
        return message.react(client.emoji.done);
    },
);
