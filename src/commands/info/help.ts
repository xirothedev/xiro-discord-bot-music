import config from "@/config";
import prefix from "@/layouts/prefix";
import { EmbedBuilder, userMention } from "discord.js";
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
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.info,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const commands = client.collection.prefixcommands;
        const categories = [...new Set(commands.map((cmd) => cmd.options.category))];

        // Nếu có đối số, hiển thị thông tin về lệnh cụ thể
        if (args[0]) {
            const command = commands.get(args[0].toLowerCase());
            if (!command) {
                return await message.channel.send({
                    embeds: [embed.setColor(client.color.red).setDescription(`❌ Lệnh \`${args[0]}\` không tồn tại.`)],
                });
            }

            const helpEmbed = embed
                .setColor(client.color.main)
                .setAuthor({
                    iconURL: message.guild.iconURL() || undefined,
                    name: `📜 Menu trợ giúp - ${command.name}`,
                })
                .setDescription(
                    `
                    **Mô tả:** ${command.options.description.content}
                    **Cách sử dụng:** \`${client.prefix} ${command.options.description.usage}\`
                    **Ví dụ:** ${command.options.description.examples
                        .map((example) => `\`${client.prefix}${example}\``)
                        .join(", ")}
                    **Biệt danh:** ${command.options.aliases?.map((alias) => `\`${alias}\``).join(", ") || "Không có"}
                    **Thời gian chờ:** ${command.options.cooldown}
                `,
                )
                .setFooter({ iconURL: message.author.displayAvatarURL(), text: `@${message.author.username}` })
                .setTimestamp();

            return await message.channel.send({ embeds: [helpEmbed] });
        }

        // Tạo danh sách các lệnh theo danh mục
        const fields = categories.map((category) => ({
            name: `**${category}**`,
            value:
                commands
                    .filter((cmd) => cmd.options.category === category)
                    .map((cmd) => `\`${cmd.name}\``)
                    .join(", ") || "Không có lệnh nào.",
            inline: false,
        }));

        const helpEmbed = embed
            .setColor(client.color.main)
            .setTitle("🛠️ Menu trợ giúp")
            .setDescription(
                `
                Chào bạn! Tôi là ${client.user?.displayName}, một bot phát nhạc được tạo bởi ${userMention(config.users.ownerId)}.
                Bạn có thể sử dụng \`${client.prefix}help <command>\` để biết thêm thông tin về lệnh.
            `,
            )
            .setFooter({ text: `Sử dụng ${client.prefix}help <command> để biết thêm thông tin về lệnh` })
            .addFields(...fields)
            .setTimestamp();

        return await message.channel.send({ embeds: [helpEmbed] });
    },
);
