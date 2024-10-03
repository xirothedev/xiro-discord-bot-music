import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { inspect } from "node:util";
import { Category } from "typings/utils";

export default prefix(
    "eval",
    {
        description: {
            content: "Run javascript",
            usage: "eval [code]",
            examples: ["eval 1 + 1"],
        },
        developersOnly: true,
        category: Category.dev,
        hidden: true,
    },
    async (client, message, args) => {
        if (args.length === 0)
            return await message.channel.send({
                embeds: [
                    {
                        description: "Please type code to run.",
                        color: client.color.red,
                    },
                ],
            });

        const start = Date.now();

        const resultEmbed = new EmbedBuilder()
            .setFooter({
                text: `Debugging for ${client.user.username}`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setColor(client.color.green)
            .setTimestamp();

        const code = args.join(" ");
        const speed = Date.now() - start;

        try {
            const executed = await eval(code);
            resultEmbed
                .setAuthor({
                    name: "Run successfully!",
                    iconURL: client.user.displayAvatarURL(),
                })
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
                    }
                );
        } catch (error: any) {
            resultEmbed
                .setAuthor({
                    name: "Run failure!",
                    iconURL: client.user.displayAvatarURL(),
                })
                .addFields(
                    {
                        name: `・Code`,
                        value: `\`\`\`js\n${code}\`\`\``,
                    },
                    {
                        name: `・Error`,
                        value: `\`\`\`js\n${error.name}: ${error.message}\`\`\``,
                    }
                );
        }

        message.channel.send({ embeds: [resultEmbed] });
    }
);
