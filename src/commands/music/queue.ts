import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import type { Requester } from "@/typings/player";
import { Category } from "@/typings/utils";

export default prefix(
    "queue",
    {
        description: {
            content: "Hiển thị hàng chờ hiện tại",
            examples: ["queue"],
            usage: "queue",
        },
        aliases: ["q"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();

        if (!player) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Không có player đang hoạt động.")],
            });
        }

        const currentTrack = player.queue.current;
        if (currentTrack && player.queue.tracks.length === 0) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.main)
                        .setDescription(
                            `Đang phát: [${currentTrack.info.title}](${currentTrack.info.uri}) - Yêu cầu bởi: <@${(currentTrack.requester as Requester).id}> - Thời lượng: \`${currentTrack.info.isStream ? "TRỰC TIẾP" : client.utils.formatTime(currentTrack.info.duration)}\``,
                        ),
                ],
            });
        }

        const songStrings = player.queue.tracks.map(
            (track, index) =>
                `${index + 1}. [${track.info.title}](${track.info.uri}) - Yêu cầu bởi: <@${(track.requester as Requester).id}> - Thời lượng: \`${track.info.isStream ? "TRỰC TIẾP" : client.utils.formatTime(track.info.duration!)}\``,
        );

        const chunks = client.utils.chunk(songStrings, 10);
        const pages = chunks.map((chunk, index) =>
            new EmbedBuilder()
                .setColor(client.color.main)
                .setAuthor({ name: "Hàng chờ", iconURL: message.guild.iconURL()! })
                .setDescription(chunk.join("\n"))
                .setFooter({ text: `Trang ${index + 1} của ${chunks.length}` }),
        );

        return client.utils.paginate(client, message, pages);
    },
);
