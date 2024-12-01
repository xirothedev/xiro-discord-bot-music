import config from "@/config";
import prefix from "@/layouts/prefix";
import { EmbedBuilder, time } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "premium",
    {
        description: {
            content: "desc.premium",
            examples: ["premium", "premium guild"],
            usage: "premium (guild)",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.info,
    },
    async (client, guild, user, message, args) => {
        const isGuild = args[0] === "guild";
        const identify = isGuild ? guild : user;

        // Check for premium status
        const isPremium = (identify.premiumTo instanceof Date && identify.premiumTo.getTime() > Date.now()) || isGuild;

        // Construct the embed
        const embed = new EmbedBuilder()
            .setAuthor({
                iconURL: client.user.displayAvatarURL(),
                name: "Trạng thái premium",
                url: `https://discord.com/users/${config.users.ownerId}`,
            })
            .setColor(client.color.main)
            .setDescription(
                client.locale(guild, "premium.message", {
                    status: client.locale(guild, isPremium ? "premium.active" : "premium.inactive"),
                    from:
                        isPremium && identify.premiumFrom
                            ? time(identify.premiumFrom, "R")
                            : client.locale(guild, "use_many.dont_have_data"),
                    to:
                        isPremium && identify.premiumTo
                            ? time(identify.premiumTo, "R")
                            : client.locale(guild, "use_many.dont_have_data"),
                    plans:
                        identify.premiumPlan?.length > 0
                            ? identify.premiumPlan.map((plan) => `\`${plan}\``).join(", ")
                            : client.locale(guild, "use_many.dont_have_data"),
                }),
            )
            .setTimestamp()
            .setFooter({
                text: `@${isGuild ? message.guild?.name : message.author.username}`,
                iconURL: isGuild ? (message.guild?.iconURL() ?? undefined) : message.author.displayAvatarURL(),
            });

        return message.channel.send({ embeds: [embed] });
    },
);
