import prefix from "@/layouts/prefix";
import { EmbedBuilder, type PermissionResolvable } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "help",
    {
        description: {
            content: "Hiển thị menu trợ giúp.",
            examples: ["help"],
            usage: "help",
        },
        aliases: ["h"],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.info,
    },
    async (client, message, args) => {
        const embed = new EmbedBuilder();
        const commands = client.collection.prefixcommands;
        const categories = [...new Set(commands.map((cmd) => cmd.options.category))];

        if (args[0]) {
            const command = client.collection.prefixcommands.get(args[0].toLowerCase());
            if (!command) {
                return await message.channel.send({
                    embeds: [embed.setColor(client.color.red).setDescription(`Lệnh \`${args[0]}\` này không tồn tại.`)],
                });
            }
            const helpEmbed = embed
                .setColor(client.color.main)
                .setTitle(`Menu trợ giúp - ${command.name}`)
                .setDescription(
                    `**Mô tả:** ${command.options.description.content}\n**Cách sử dụng:** ${client.prefix}${
                        command.options.description.usage
                    }\n**Ví dụ:** ${command.options.description.examples
                        .map((example: string) => `${client.prefix}${example}`)
                        .join(", ")}\n**Biệt danh:** ${
                        command.options.aliases?.map((alias: string) => `\`${alias}\``).join(", ") || "Không có"
                    }\n**Danh mục:** ${command.options.category}\n**Thời gian chờ:** ${
                        command.options.cooldown
                    }\n**Quyền của người dùng:** ${
                        command.options.userPermissions
                            ?.map((perm: PermissionResolvable) => `\`${perm.toString()}\``)
                            .join(", ") || "Không có"
                    }\n**Quyền của bot:** ${
                        command.options.botPermissions
                            ?.map((perm: PermissionResolvable) => `\`${perm.toString()}\``)
                            .join(", ") || "Không có"
                    }\n**Chỉ dành cho nhà phát triển:** ${command.options.developersOnly ? "Có" : "Không"}`
                );
            return await message.channel.send({ embeds: [helpEmbed] });
        }

        const fields = categories.map((category) => ({
            name: category,
            value: commands
                .filter((cmd) => cmd.options.category === category)
                .map((cmd) => `\`${cmd.name}\``)
                .join(", "),
            inline: false,
        }));

        const helpEmbed = embed
            .setColor(client.color.main)
            .setTitle("Menu trợ giúp")
            .setDescription(
                `Chào bạn! Tôi là ${client.user?.displayName}, một bot phát nhạc được tạo bởi Phố Người Việt. Bạn có thể sử dụng \`${client.prefix}help <command>\` để biết thêm thông tin về lệnh.`
            )
            .setFooter({
                text: `Sử dụng ${client.prefix}help <command> để biết thêm thông tin về lệnh`,
            })
            .addFields(...fields);

        return await message.channel.send({ embeds: [helpEmbed] });
    }
);
