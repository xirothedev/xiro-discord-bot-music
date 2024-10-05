import prefix from "@/layouts/prefix";
import { EmbedBuilder, VoiceChannel } from "discord.js";
import type { Requester } from "typings/player";
import { Category } from "typings/utils";

export default prefix(
    "queue",
    {
        description: {
            content: "Hiển thị hàng chờ hiện tại",
            examples: ["queue"],
            usage: "queue",
        },
        beta: true,
        aliases: ["q"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const player = client.manager.getPlayer(message.guildId);
        const embed = new EmbedBuilder();
        if (player.queue.current && player.queue.tracks.length === 0) {
            return await message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color.main)
                        .setDescription(
                            `Đang phát: [${player.queue.current.info.title}](${
                                player.queue.current.info.uri
                            }) - Yêu cầu bởi: <@${(player.queue.current.requester as Requester).id}> - Thời lượng: \`${
                                player.queue.current.info.isStream
                                    ? "TRỰC TIẾP"
                                    : client.utils.formatTime(player.queue.current.info.duration)
                            }\``
                        ),
                ],
            });
        }
        
        const songStrings: string[] = [];
        for (let i = 0; i < player.queue.tracks.length; i++) {
            const track = player.queue.tracks[i];
            songStrings.push(
                `${i + 1}. [${track.info.title}](${track.info.uri}) - Yêu cầu bởi: <@${
                    (track.requester as Requester).id
                }> - Thời lượng: \`${
                    track.info.isStream ? "TRỰC TIẾP" : client.utils.formatTime(track.info.duration!)
                }\``
            );
        }

        let chunks = client.utils.chunk(songStrings, 10);

        if (chunks.length === 0) chunks = [songStrings];

        const pages = chunks.map((chunk, index) => {
            return new EmbedBuilder()
                .setColor(client.color.main)
                .setAuthor({
                    name: "Hàng chờ",
                    iconURL: message.guild.iconURL()!,
                })
                .setDescription(chunk.join("\n"))
                .setFooter({ text: `Trang ${index + 1} của ${chunks.length}` });
        });

        return await client.utils.paginate(client, message, pages);
    }
);
