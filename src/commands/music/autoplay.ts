import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "autoplay",
    {
        description: {
            content: "Bật/tắt chế độ tự động phát",
            examples: ["autoplay"],
            usage: "autoplay",
        },
        beta: true,
        aliases: ["ap"],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        if (!player) {
            return await message.channel.send({
                embeds: [
                    {
                        description: "Không có player hoạt động trong server.",
                        color: client.color.red,
                    },
                ],
            });
        }

        const embed = new EmbedBuilder();
        const autoplay = player.get<boolean>("autoplay");

        player.set("autoplay", !autoplay);

        if (autoplay) {
            embed.setDescription("`✅` | Chế độ tự động phát đã được `TẮT`.").setColor(client.color.main);
        } else {
            embed.setDescription("`✅` | Chế độ tự động phát đã được `BẬT`.").setColor(client.color.main);
        }

        await message.channel.send({ embeds: [embed] });
    }
);
