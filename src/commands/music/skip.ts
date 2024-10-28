import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "skip",
    {
        description: {
            content: "Bỏ qua bài hát hiện tại hoặc đến một bài hát cụ thể trong hàng chờ.",
            examples: ["skip", "skip 3"],
            usage: "skip (chỉ mục bài hát)",
        },
        aliases: ["sk", "skt"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player || player.queue.tracks.length === 0) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Không có bài hát nào trong danh sách phát.")],
            });
        }

        if (args[0]) {
            const num = Number(args[0]);

            if (Number.isNaN(num) || num > player.queue.tracks.length || num < 1) {
                return await message.channel.send({
                    embeds: [embed.setColor(client.color.red).setDescription("Vui lòng cung cấp một số hợp lệ.")],
                });
            }

            await player.skip(num);
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.main)
                        .setDescription(`Đã bỏ qua đến bài hát số **${num}** trong hàng chờ.`),
                ],
            });
        }

        await player.skip();
        return await message.react(client.emoji.done);
    },
);
