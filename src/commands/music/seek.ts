import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import ms from "ms";
import { T } from "@/handlers/i18n";

export default prefix(
    "seek",
    {
        description: {
            content: "desc.seek",
            examples: ["seek 1m", "seek 1h 30m", "seek 1h 30m 30s"],
            usage: "seek [duration]",
        },
        aliases: ["s"],
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
        const currentTrack = player.queue.current?.info;
        const embed = new EmbedBuilder();

        const duration = ms(args.join(" "));

        if (!duration) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(
                            T(guild.language, "error.common.invalid_duration"),
                        ),
                ],
            });
        }

        if (!currentTrack?.isSeekable) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(T(guild.language, "error.player.cant_seek")),
                ],
            });
        }

        if (duration > currentTrack.duration) {
            return await message.channel.send({
                embeds: [
                    embed.setColor(client.color.red).setDescription(
                        T(guild.language, "error.player.maxium_seek", {
                            duration: client.utils.formatTime(currentTrack.duration),
                        }),
                    ),
                ],
            });
        }

        await player.seek(duration);
        return await message.react(client.emoji.done);
    },
);
