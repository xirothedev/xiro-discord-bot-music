import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { inspect } from "node:util";
import { Category } from "@/typings/utils";

export default prefix(
    "eval",
    {
        description: {
            content: "desc.eval",
            usage: "eval [code]",
            examples: ["eval 1 + 1"],
        },
        specialRole: "dev",
        category: Category.dev,
        hidden: true,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();

        if (args.length === 0) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setDescription("Please type code to run.")
                        .setColor(client.color.red),
                ],
            });
        }

        const start = Date.now();

        embed
            .setFooter({
                text: `Debugging for ${client.user.username}`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

        const code = args.join(" ");
        const speed = Date.now() - start;

        try {
            const executed = await eval(code);
            embed
                .setAuthor({
                    name: "Run successfully!",
                    iconURL: client.user.displayAvatarURL(),
                })
                .setColor(client.color.green)
                .addFields(
                    {
                        name: `・Type`,
                        value: `\`\`\`prolog\n${typeof executed}\`\`\``,
                    },
                    {
                        name: `・Speed`,
                        value: `\`\`\`ytml\n${speed}ms\`\`\``,
                    },
                    {
                        name: `・Code`,
                        value: `\`\`\`js\n${code}\`\`\``,
                    },
                    {
                        name: `・Output`,
                        value: `\`\`\`js\n${inspect(executed, { depth: 0 })}\`\`\``,
                    },
                );
        } catch (error: any) {
            embed
                .setAuthor({
                    name: "Run failure!",
                    iconURL: client.user.displayAvatarURL(),
                })
                .setColor(client.color.red)
                .addFields(
                    {
                        name: `・Code`,
                        value: `\`\`\`js\n${code}\`\`\``,
                    },
                    {
                        name: `・Error`,
                        value: `\`\`\`js\n${error.name}: ${error.message}\`\`\``,
                    },
                );
        }

        await message.channel.send({ embeds: [embed] });
    },
);
