import { T } from "@/handlers/i18n";
import prefix from "@/layouts/prefix";
import { Category, Language } from "@/typings/utils";
import { EmbedBuilder } from "discord.js";

export default prefix(
    "language",
    {
        description: {
            content: "commands.desc.admin.language",
            usage: "language Vietnamese",
            examples: ["language (language)"],
        },
        aliases: ["lang"],
        category: Category.admin,
        hidden: true,
        userPermissions: ["Administrator"],
    },
    async (client, guild, user, message, args) => {
        const langs = Object.keys(Language);
        const lang = args[0];
        const embed = new EmbedBuilder();

        if (lang) {
            const langNeedChange = langs.find(
                (f) => f.toLowerCase() === lang.toLowerCase(),
            );

            if (!langNeedChange) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setDescription(
                                T(guild.language, "error.language", {
                                    lang: langs.join(", "),
                                }),
                            )
                            .setColor(client.color.red),
                    ],
                });
            }

            guild = await client.prisma.guild.update({
                where: {
                    guildId: message.guildId,
                },
                data: {
                    language: langNeedChange,
                },
            });

            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            T(guild.language, "success.language_change", {
                                lang: guild.language,
                            }),
                        )
                        .setColor(client.color.main),
                ],
            });
        } else {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            T(guild.language, "success.language", {
                                lang: guild.language,
                            }),
                        )
                        .setColor(client.color.main),
                ],
            });
        }
    },
);
