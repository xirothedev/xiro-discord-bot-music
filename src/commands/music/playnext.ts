import config from "@/config";
import prefix from "@/layouts/prefix";
import { EmbedBuilder, userMention, VoiceChannel } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "playnext",
    {
        description: {
            content: "Thêm bài hát để phát tiếp theo trong hàng chờ",
            examples: [
                "playnext example",
                "playnext https://www.youtube.com/watch?v=example",
                "playnext https://open.spotify.com/track/example",
                "playnext http://www.example.com/example.mp3",
            ],
            usage: "playnext <song>",
        },
        aliases: ["pn"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const query = args.join(" ");
        const embed = new EmbedBuilder();

        if (!query) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Vui lòng cung cấp từ khóa hoặc đường dẫn.")],
            });
        }
        let player = client.manager.getPlayer(message.guildId);
        const memberVoiceChannel = message.member?.voice.channel as VoiceChannel;

        if (!player)
            player = client.manager.createPlayer({
                guildId: message.guildId,
                voiceChannelId: memberVoiceChannel.id,
                textChannelId: message.channelId,
                selfMute: false,
                selfDeaf: true,
                vcRegion: memberVoiceChannel.rtcRegion || "",
            });

        if (!player.connected) await player.connect();

        const msg = await message.channel.send("Đang tải...");
        try {
            const response = await player.search({ query }, message.author);

            if (!response || response.tracks?.length === 0) {
                return await message.edit({
                    content: "",
                    embeds: [embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi khi tìm kiếm.")],
                });
            }
            await player.queue.splice(0, 0, response.loadType === "playlist" ? response.tracks : response.tracks[0]);

            if (response.loadType === "playlist") {
                await msg.edit({
                    content: "",
                    embeds: [
                        embed
                            .setColor(client.color.main)
                            .setDescription(
                                `Đã thêm ${response.tracks.length} bài hát để phát tiếp theo trong hàng chờ.`,
                            ),
                    ],
                });
            } else {
                await msg.edit({
                    content: "",
                    embeds: [
                        embed
                            .setColor(client.color.main)
                            .setDescription(
                                `Đã thêm [${response.tracks[0].info.title}](${response.tracks[0].info.uri}) để phát tiếp theo trong hàng chờ.`,
                            ),
                    ],
                });
            }

            if (!player.playing) await player.play({ paused: false });
        } catch (error: any) {
            console.error(error);
            const log = client.utils.createLog(client, JSON.stringify(error), Bun.main, message.author);
            return await msg.edit({
                content: "",
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(`Đã xảy ra lỗi. Vui lòng báo mã lỗi \`${(await log).logId}\` ${userMention(config.users.ownerId)}!`),
                ],
            });
        }
    },
);
