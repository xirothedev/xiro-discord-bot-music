import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "ping",
    {
        description: {
            content: "Hiển thị độ trễ của bot.",
            examples: ["ping"],
            usage: "ping",
        },
        aliases: ["pong"],
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.info,
    },
    async (client, message, args) => {
        const msg = await message.channel.send("Đang kiểm tra độ trễ...");

        const botLatency = msg.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        const botLatencySign = botLatency < 600 ? "+" : "-";
        const apiLatencySign = apiLatency < 500 ? "+" : "-";

        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Pong",
                iconURL: client.user?.displayAvatarURL(),
            })
            .setColor(client.color.main)
            .addFields([
                {
                    name: "Độ trễ của Bot",
                    value: `\`\`\`diff\n${botLatencySign} ${botLatency}ms\n\`\`\``,
                    inline: true,
                },
                {
                    name: "Độ trễ của API",
                    value: `\`\`\`diff\n${apiLatencySign} ${apiLatency}ms\n\`\`\``,
                    inline: true,
                },
            ])
            .setFooter({
                text: `Yêu cầu bởi ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp();

        return await msg.edit({ content: "", embeds: [embed] });
    }
);
