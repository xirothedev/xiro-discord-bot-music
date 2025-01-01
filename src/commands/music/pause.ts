import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "pause",
    {
        description: {
            content: "desc.pause",
            examples: ["pause"],
            usage: "pause",
        },
        aliases: [],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: [
            "SendMessages",
            "ReadMessageHistory",
            "ViewChannel",
            "EmbedLinks",
        ],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);

        if (player.paused) {
            const embed = new EmbedBuilder()
                .setColor(client.color.red)
                .setDescription(T(guild.language, "error.player.paused"));
            return await message.channel.send({ embeds: [embed] });
        }

        await player.pause();
        return await message.react(client.emoji.done);
    },
);
