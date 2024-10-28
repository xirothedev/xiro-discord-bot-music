import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "volume",
    {
        description: {
            content: "Đặt âm lượng của trình phát.",
            examples: ["volume 100"],
            usage: "volume [mức độ]",
        },
        aliases: ["v", "vol"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const number = Number(args[0]);

        if (Number.isNaN(number) || number < 0 || number > 200) {
            let description = "";
            if (Number.isNaN(number)) {
                description = "Vui lòng cung cấp một số hợp lệ.";
            } else if (number < 0) {
                description = "Âm lượng không thể thấp hơn 0.";
            } else if (number > 200) {
                description =
                    "Âm lượng không thể cao hơn 200. Bạn có muốn làm hỏng tai hoặc loa của mình không? Hmmm, tôi không nghĩ đó là một ý kiến hay.";
            }

            return await message.channel.send({
                embeds: [new EmbedBuilder().setColor(client.color.red).setDescription(description)],
            });
        }

        await player.setVolume(number);

        return await message.react(client.emoji.done);
    },
);
