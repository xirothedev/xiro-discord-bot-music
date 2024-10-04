import prefix from "@/layouts/prefix";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Category } from "typings/utils";
import { exec } from "node:child_process";

export default prefix(
    "restart",
    {
        description: {
            content: "Restart the bot",
            examples: ["restart"],
            usage: "restart",
        },
        aliases: ["reboot"],
        developersOnly: true,
        category: Category.dev,
        hidden: true,
    },
    async (client, message, args) => {
        const embed = new EmbedBuilder();
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel("Confirm Restart")
            .setCustomId("confirm-restart");
        const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button);
        const restartEmbed = embed
            .setColor(client.color.red)
            .setDescription(`**Are you sure you want to restart **\`${client.user?.username}\`?`)
            .setTimestamp();

        const msg = await message.channel.send({
            embeds: [restartEmbed],
            components: [row],
        });

        const collector = msg.createMessageComponentCollector({
            time: 30000,
            filter: (f) => f.customId === "confirm-restart" && f.user.id === message.author.id,
        });

        collector.on("collect", async (i) => {
            await i.deferUpdate();

            await msg.edit({
                content: "Restarting the bot...",
                embeds: [],
                components: [],
            });

            await client.destroy();
            exec("bun run scripts/restart.js");
            process.exit(0);
        });

        collector.on("end", async () => {
            if (collector.collected.size === 0) {
                await msg.edit({
                    content: "Restart cancelled.",
                    components: [],
                });
            }
        });
    }
);
