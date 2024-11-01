import config from "@/config";
import prefix from "@/layouts/prefix";
import { EmbedBuilder, userMention } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "help",
    {
        description: {
            content: "desc.help",
            examples: ["help", "help play"],
            usage: "help (cmd)",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.info,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const commands = client.collection.prefixcommands.filter((f) => !f.options.hidden && !f.options.ignore);
        const categories = [...new Set(commands.map((cmd) => cmd.options.category))];

        if (args[0]) {
            const command = commands.get(args[0].toLowerCase());
            if (!command) {
                return await message.channel.send({
                    embeds: [
                        embed.setColor(client.color.red).setDescription(
                            client.locale(guild, "error.help.cmd_not_found", {
                                cmd: args[0],
                            }),
                        ),
                    ],
                });
            }

            const helpEmbed = embed
                .setColor(client.color.main)
                .setAuthor({
                    iconURL: message.guild.iconURL() || undefined,
                    name: `${client.locale(guild, "help.title")} - ${command.name}`,
                })
                .setDescription(
                    client.locale(guild, "help.detail", {
                        content: client.locale(guild, command.options.description.content),
                        usage: `${client.prefix} ${command.options.description.usage}`,
                        examples: command.options.description.examples
                            .map((example) => `\`${client.prefix}${example}\``)
                            .join(", "),
                        aliases:
                            command.options.aliases?.map((alias) => `\`${alias}\``).join(", ") ||
                            client.locale(guild, "use_many.dont_have"),
                        cooldown: command.options.cooldown,
                    }),
                )
                .setFooter({ iconURL: message.author.displayAvatarURL(), text: `@${message.author.username}` })
                .setTimestamp();

            return await message.channel.send({ embeds: [helpEmbed] });
        }

        const fields = categories.map((category) => ({
            name: `**${category}**`,
            value: commands
                .filter((cmd) => cmd.options.category === category)
                .map((cmd) => `\`${cmd.name}\``)
                .join(", "),
            inline: false,
        }));

        const helpEmbed = embed
            .setColor(client.color.main)
            .setTitle(client.locale(guild, "help.title"))
            .setDescription(
                client.locale(guild, "help.description", {
                    displayName: client.user?.displayName,
                    owner: userMention(config.users.ownerId),
                    prefix: client.prefix,
                }),
            )
            .setFooter({
                text: client.locale(guild, "help.footer", {
                    prefix: client.prefix,
                }),
            })
            .addFields(...fields)
            .setTimestamp();

        return await message.channel.send({ embeds: [helpEmbed] });
    },
);
