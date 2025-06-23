import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "skip",
    {
        description: {
            content: "desc.skip",
            examples: ["skip", "skip 3"],
            usage: "skip (chỉ mục bài hát)",
        },
        aliases: ["sk", "skt"],
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
        const embed = new EmbedBuilder();

        if (!player || player.queue.tracks.length === 0) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(
                            T(guild.language, "error.player.no_song_in_queue"),
                        ),
                ],
            });
        }

        if (args[0]) {
            const num = Number(args[0]);

            if (Number.isNaN(num) || num > player.queue.tracks.length || num < 1) {
                return await message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color.red)
                            .setDescription(
                                T(guild.language, "error.common.invalid_number"),
                            ),
                    ],
                });
            }

            await player.skip(num);
            return await message.channel.send({
                embeds: [
                    embed.setColor(client.color.main).setDescription(
                        T(guild.language, "success.skipped", {
                            number: num,
                        }),
                    ),
                ],
            });
        }

        await player.skip();
        return await message.react(client.emoji.done);
    },
);
