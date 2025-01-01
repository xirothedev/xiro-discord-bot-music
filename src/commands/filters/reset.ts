import prefix from "@/layouts/prefix";
import { Category } from "@/typings/utils";

export default prefix(
    "reset",
    {
        description: {
            content: "desc.reset",
            examples: ["reset"],
            usage: "reset",
        },
        aliases: ["rs"],
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
        category: Category.filters,
    },
    async (client, guild, user, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        player?.filterManager.resetFilters();
        player?.filterManager.clearEQ();
        return await message.react(client.emoji.done);
    },
);
