import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "seek",
    {
        description: {
            content: "Tua đến một thời điểm nhất định trong bài hát",
            examples: ["seek 1m, seek 1h 30m", "seek 1h 30m 30s"],
            usage: "seek <duration>",
        },
        aliases: ["s"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const current = player.queue.current?.info;
        const embed = new EmbedBuilder();
        const duration = client.utils.parseTime(args.join(" "));
        if (!duration) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription("Định dạng thời gian không hợp lệ. Ví dụ: seek 1m, seek 1h 30m"),
                ],
            });
        }

        if (!current?.isSeekable) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Không thể tua bài hát này.")],
            });
        }

        if (duration > current.duration) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(
                            `Không thể tìm kiếm vượt quá thời lượng bài hát ${client.utils.formatTime(
                                current.duration,
                            )}.`,
                        ),
                ],
            });
        }
        await player.seek(duration);
        return await message.react(client.emoji.done);
    },
);
