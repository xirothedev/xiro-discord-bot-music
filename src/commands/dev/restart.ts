import prefix from "@/layouts/prefix";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { exec } from "node:child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default prefix(
    "restart",
    {
        description: {
            content: "desc.restart",
            examples: ["restart"],
            usage: "restart",
        },
        aliases: ["reboot"],
        specialRole: "dev",
        category: Category.dev,
        hidden: true,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder()
            .setColor(client.color.red)
            .setDescription(
                `**Are you sure you want to restart **\`${client.user?.username}\`?`,
            )
            .setTimestamp();

        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel("Confirm Restart")
            .setCustomId("confirm-restart");

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        const msg = await message.channel.send({
            embeds: [embed],
            components: [row],
        });

        const collector = msg.createMessageComponentCollector({
            time: 30000,
            filter: (f) =>
                f.customId === "confirm-restart" && f.user.id === message.author.id,
        });

        collector.on("collect", async (i) => {
            await i.deferUpdate();
            await msg.edit({
                content: "Restarting the bot...",
                embeds: [],
                components: [],
            });

            await client.destroy();

            try {
                await execAsync("bun run scripts/restart.ts");
            } catch (error) {
                console.error("Error during restart: ", error);
            } finally {
                process.exit(0);
            }
        });

        collector.on("end", async (collected) => {
            if (collected.size === 0) {
                await msg.edit({
                    content: "Restart cancelled.",
                    components: [],
                });
            }
        });
    },
);
