import getGuildFromArgs from "@/functions/getGuildFromArgs";
import getUserFromArgs from "@/functions/getUserFromArgs";
import prefix from "@/layouts/prefix";
import { PremiumPlan } from "@prisma/client";
import { addMonths } from "date-fns";
import { EmbedBuilder, Guild, User } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "addpremium",
    {
        description: {
            content: "Add premium",
            usage: "addpremium [guild | user] [trial | temp | life] [user id]",
            examples: ["addpremium user trial 1291013382849167542"],
        },
        aliases: ["addpre"],
        ownerOnly: true,
        category: Category.admin,
        hidden: true,
    },
    async (client, guild, user, message, args) => {
        const scopes = ["guild", "user"];
        const plans = ["trial", "temp", "life"];
        const embed = new EmbedBuilder();

        const scope = args[0];
        const plan = args[1];
        let id: string | User | Guild | null | undefined = args[2];

        if (!scope || !scopes.includes(scope)) {
            return await message.channel.send({
                embeds: [embed.setDescription(`Vui lòng chọn scope: ${scopes.join(", ")}.`).setColor(client.color.red)],
            });
        }

        if (!plan || !plans.includes(plan)) {
            return await message.channel.send({
                embeds: [embed.setDescription(`Vui lòng chọn plan: ${plans.join(", ")}.`).setColor(client.color.red)],
            });
        }

        if (plan === "life" && scope === "guild") {
            return await message.channel.send({
                embeds: [embed.setDescription(`Scope guild không thể cấp premium life.`).setColor(client.color.red)],
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

        const parsePlan =
            plan === "trial"
                ? PremiumPlan.TrialPremium
                : plan === "temp"
                  ? PremiumPlan.TemporaryPremium
                  : PremiumPlan.LifePremium;

        if (scope === "guild") {
            const server = await client.prisma.guild.findUnique({ where: { guildId: id.id } });

            await client.prisma.guild.upsert({
                where: { guildId: id.id },
                create: {
                    guildId: id.id,
                    premiumFrom: new Date(),
                    premiumTo: addMonths(new Date(), 1),
                    premiumPlan: [parsePlan],
                },
                update: {
                    premiumFrom: server?.premiumFrom || new Date(),
                    premiumTo: addMonths(server?.premiumTo || new Date(), 1),
                    premiumPlan: { push: parsePlan },
                },
            });

            return message.react(client.emoji.done);
        } else {
            const member = await client.prisma.user.findUnique({ where: { userId: id.id } });

            await client.prisma.user.upsert({
                where: { userId: id.id },
                create: {
                    userId: id.id,
                    premiumFrom: new Date(),
                    premiumTo: addMonths(new Date(), 1),
                    premiumPlan: [parsePlan],
                },
                update: {
                    premiumFrom: member?.premiumFrom || new Date(),
                    premiumTo: addMonths(member?.premiumTo || new Date(), 1),
                    premiumPlan: { push: parsePlan },
                    premiumKey: plan === "life" ? { create: {} } : undefined,
                },
            });

            return message.react(client.emoji.done);
        }
    },
);
