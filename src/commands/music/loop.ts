import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "loop",
    {
        description: {
            content: "Lặp lại bài hát hiện tại hoặc hàng chờ",
            examples: ["loop", "loop queue", "loop song"],
            usage: "loop",
        },
        aliases: [],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color.main);
        const player = client.manager.getPlayer(message.guildId);
        let loopMessage = "";

        switch (player?.repeatMode) {
            case "off": {
                await player.setRepeatMode("track");
                loopMessage = "**Đang lặp lại bài hát.**";
                break;
            }
            case "track": {
                await player.setRepeatMode("queue");
                loopMessage = "**Đang lặp lại hàng chờ.**";
                break;
            }
            case "queue": {
                await player.setRepeatMode("off");
                loopMessage = "**Đã tắt chế độ lặp lại.**";
                break;
            }
        }

        return await message.channel.send({
            embeds: [embed.setDescription(loopMessage)],
        });
    }
);
