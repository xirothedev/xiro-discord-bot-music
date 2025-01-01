import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";
import { T } from "@/handlers/i18n";

export default prefix(
    "clearqueue",
    {
        description: {
            content: "desc.clearqueue",
            examples: ["clearqueue"],
            usage: "clearqueue",
        },
        aliases: ["cq"],
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
    async (client, guild, user, message) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player) {
            embed
                .setColor(client.color.red)
                .setDescription(T(guild.language, "error.player.no_player"));
            return await message.channel.send({ embeds: [embed] });
        }

        if (player.queue.tracks.length === 0) {
            embed
                .setColor(client.color.red)
                .setDescription(T(guild.language, "error.player.no_song_in_queue"));
            return await message.channel.send({ embeds: [embed] });
        }

        player.queue.tracks.splice(0, player.queue.tracks.length);

        await message.react(client.emoji.done);
    },
);
