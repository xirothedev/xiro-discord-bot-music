import getGuildFromArgs from "@/functions/getGuildFromArgs";
import getUserFromArgs from "@/functions/getUserFromArgs";
import prefix from "@/layouts/prefix";
import { EmbedBuilder, Guild, User } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "register",
    {
        description: {
            content: "desc.register",
            usage: "register [guild | user] [id/@user]",
            examples: ["register user @Shiroko"],
        },
        aliases: ["reg"],
        specialRole: "dev",
        category: Category.dev,
        hidden: true,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const scopes = ["guild", "user"];

        const scope = args[0];
        let id: string | User | Guild | null | undefined = args[1];

        if (!scope || !scopes.includes(scope)) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            T(guild.language, "error.scope", {
                                scope: scopes.join(", "),
                            }),
                        )
                        .setColor(client.color.red),
                ],
            });
        }

        if (!id) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "error.user_or_guild"))
                        .setColor(client.color.red),
                ],
            });
        }

        if (scope === "guild") {
            id = await getGuildFromArgs(client, id);
        } else {
            id = await getUserFromArgs(client, id);
        }

        if (!id) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setDescription(T(guild.language, "error.invalid_user_or_guild"))
                        .setColor(client.color.red),
                ],
            });
        }

        if (scope === "guild") {
            const server = await client.prisma.guild.findUnique({
                where: { guildId: id.id },
            });

            if (server) {
                return await message.channel.send({
                    embeds: [
                        embed
                            .setDescription(T(guild.language, "error.user.user_exist"))
                            .setColor(client.color.red),
                    ],
                });
            }

            await client.prisma.guild.create({ data: { guildId: id.id } });

            return message.react(client.emoji.done);
        } else {
            const member = await client.prisma.user.findUnique({
                where: { userId: id.id },
            });

            if (member) {
                return await message.channel.send({
                    embeds: [
                        embed
                            .setDescription(T(guild.language, "error.guild.guild_exist"))
                            .setColor(client.color.red),
                    ],
                });
            }

            await client.prisma.user.create({ data: { userId: id.id } });

            return message.react(client.emoji.done);
        }
    },
);
