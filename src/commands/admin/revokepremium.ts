import getGuildFromArgs from "@/functions/getGuildFromArgs";
import getUserFromArgs from "@/functions/getUserFromArgs";
import prefix from "@/layouts/prefix";
import { EmbedBuilder, Guild, User } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "revokepremium",
    {
        description: {
            content: "revoke premium",
            usage: "revokepremium [guild | user] [user id]",
            examples: ["revokepremium user 1291013382849167542"],
        },
        aliases: ["revokepre"],
        ownerOnly: true,
        category: Category.admin,
        hidden: true,
    },
    async (client, guild, user, message, args) => {
        const scopes = ["guild", "user"];
        const embed = new EmbedBuilder();

        const scope = args[0];
        let id: string | User | Guild | null | undefined = args[1];

        if (!scope || !scopes.includes(scope)) {
            return await message.channel.send({
                embeds: [embed.setDescription(`Vui lòng chọn scope: ${scopes.join(", ")}.`).setColor(client.color.red)],
            });
        }

        if (!id) {
            return await message.channel.send({
                embeds: [embed.setDescription(`Vui lòng cung cấp id user/guild`).setColor(client.color.red)],
            });
        }

        if (scope === "guild") {
            id = await getGuildFromArgs(client, id);
        } else {
            id = await getUserFromArgs(client, id);
        }

        if (!id) {
            return await message.channel.send({
                embeds: [embed.setDescription(`Người dùng/guild không hợp lệ`).setColor(client.color.red)],
            });
        }

        if (scope === "guild") {
            const server = await client.prisma.guild.findUnique({ where: { guildId: id.id } });

            if (!server) {
                return await message.channel.send({
                    embeds: [embed.setDescription(`Guild không tồn tại`).setColor(client.color.red)],
                });
            }

            await client.prisma.guild.update({
                where: { guildId: id.id },
                data: { premiumTo: null },
            });

            return message.react(client.emoji.done);
        } else {
            const member = await client.prisma.user.findUnique({ where: { userId: id.id } });

            if (!member) {
                return await message.channel.send({
                    embeds: [embed.setDescription(`User không tồn tại`).setColor(client.color.red)],
                });
            }

            await client.prisma.user.update({
                where: { userId: id.id },
                data: { premiumTo: null },
            });

            return message.react(client.emoji.done);
        }
    },
);
