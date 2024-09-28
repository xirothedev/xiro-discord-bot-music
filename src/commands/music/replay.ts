import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "replay",
    {
        description: {
            content: "Phát lại bài hát hiện tại",
            examples: ["replay"],
            usage: "replay",
        },
        aliases: ["rp"],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player.queue.current?.info.isSeekable) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription("Không thể phát lại bài hát này vì không thể tìm kiếm được."),
                ],
            });
        }

        await player.seek(0);
        return await message.react(client.emoji.done);
    }
);
