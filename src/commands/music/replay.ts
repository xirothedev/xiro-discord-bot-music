import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "replay",
    {
        description: {
            content: "desc.replay",
            examples: ["replay"],
            usage: "replay",
        },
        aliases: ["rp"],
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
    async (client, guild, user, message) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder().setColor(client.color.red);

        if (!player || !player.queue.current) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        T(guild.language, "error.player.no_track_playing"),
                    ),
                ],
            });
        }

        if (!player.queue.current.info.isSeekable) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(T(guild.language, "error.player.cant_replay")),
                ],
            });
        }

        await player.seek(0);
        return message.react(client.emoji.done);
    },
);
