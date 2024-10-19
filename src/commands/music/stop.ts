import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "stop",
    {
        description: {
            content: "Dừng nhạc và xóa hàng chờ",
            examples: ["stop"],
            usage: "stop",
        },
        aliases: [],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const num = Number(args[0]);

        if (player.queue.tracks.length === 0 || Number.isNaN(num) || num > player.queue.tracks.length || num < 1) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor(client.color.red).setDescription("Vui lòng cung cấp một số hợp lệ."),
                ],
            });
        }

        await player.skip(num);
        return await message.react(client.emoji.done);
    },
);
