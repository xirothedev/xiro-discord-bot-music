import getGuildFromArgs from "@/functions/getGuildFromArgs";
import getUserFromArgs from "@/functions/getUserFromArgs";
import prefix from "@/layouts/prefix";
import { codeBlock, EmbedBuilder, Guild, User } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "data",
    {
        description: {
            content: "Xem data người dùng",
            usage: "data [guild | user] [id/@người dùng]",
            examples: ["data user @Shiroko"],
        },
        developersOnly: true,
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

        let data;

        if (scope === "guild") {
            data = await client.prisma.guild.findUnique({
                where: { guildId: id.id },
            });
        } else {
            data = await client.prisma.user.findUnique({
                where: { userId: id.id },
                include: { premiumKey: true, playlists: true },
            });
        }

        return message.channel.send({ content: codeBlock("json", JSON.stringify(data, null, 2)) });
    },
);
