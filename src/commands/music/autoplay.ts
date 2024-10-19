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
        aliases: ["ap"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player) {
            return await message.channel.send({
                embeds: [embed.setDescription("Không có player hoạt động trong server.").setColor(client.color.red)],
            });
        }

        const autoplay = player.get<boolean>("autoplay");

        player.set("autoplay", !autoplay);

        if (autoplay) {
            embed.setDescription("`✅` | Chế độ tự động phát đã được `TẮT`.").setColor(client.color.main);
        } else {
            embed.setDescription("`✅` | Chế độ tự động phát đã được `BẬT`.").setColor(client.color.main);
        }

        await message.channel.send({ embeds: [embed] });
    },
);
