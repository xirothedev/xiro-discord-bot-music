import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import bots from "../../../bots.prod.json";
import config from "@/config";

export default prefix(
    "invite",
    {
        description: {
            content: "desc.invite",
            examples: ["invite"],
            usage: "invite",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.info,
    },
    async (client, guild, user, message, args) => {
        const datas = await Promise.all(
            bots.map(async (bot) => {
                const u = await client.users.fetch(bot.clientId);

                return `> ${u.toString()} [${u.username}](https://discord.com/oauth2/authorize?client_id=${bot.clientId}&permissions=40550937255168&integration_type=0&scope=bot) - (${bot.prefix})`;
            }),
        );

        const embed = new EmbedBuilder()
            .setColor(client.color.main)
            .setAuthor({
                name: client.locale(guild, "invite.author"),
                iconURL: client.user.displayAvatarURL(),
                url: "https://discord.gg/92jbTuN7ep",
            })
            .setDescription(
                client.locale(guild, "invite.description", {
                    ownerId: config.users.ownerId,
                }) +
                    "\n\n" +
                    datas.join("\n"),
            )
            .setFooter({ iconURL: message.author.displayAvatarURL(), text: `@${message.author.username}` })
            .setTimestamp();

        return message.channel.send({ embeds: [embed] });
    },
);
