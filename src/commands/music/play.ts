import prefix from "@/layouts/prefix";
import { EmbedBuilder, type VoiceBasedChannel } from "discord.js";
import { Category } from "typings/utils";

export default prefix(
    "play",
    {
        description: {
            content: "Phát một bài hát từ YouTube, Spotify hoặc link",
            examples: [
                "play example",
                "play https://www.youtube.com/watch?v=example",
                "play https://open.spotify.com/track/example",
                "play http://www.example.com/example.mp3",
            ],
            usage: "play <song>",
        },
        beta: true,
        aliases: ["p"],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const query = args.join(" ");
        const msg = await message.reply("Đang tải...");
        const memberVoiceChannel = message.member?.voice.channel as VoiceBasedChannel;

        let player = client.manager.getPlayer(message.guildId);

        if (!player)
            player = client.manager.createPlayer({
                guildId: message.guildId,
                voiceChannelId: memberVoiceChannel.id,
                textChannelId: message.channelId,
                selfMute: false,
                selfDeaf: true,
                vcRegion: memberVoiceChannel.rtcRegion!,
            });
        if (!player.connected) await player.connect();

        const response = await player.search({ query: query }, message.author);
        const embed = new EmbedBuilder();

        if (!response || response.tracks?.length === 0) {
            return await msg.edit({
                content: "",
                embeds: [embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi khi tìm kiếm.")],
            });
        }

        await player.queue.add(response.loadType === "playlist" ? response.tracks : response.tracks[0]);

        if (response.loadType === "playlist") {
            await msg.edit({
                content: "",
                embeds: [
                    embed
                        .setColor(client.color.main)
                        .setDescription(`Đã thêm ${response.tracks.length} bài hát vào hàng chờ.`),
                ],
            });
        } else {
            await msg.edit({
                content: "",
                embeds: [
                    embed
                        .setColor(client.color.main)
                        .setDescription(
                            `Đã thêm [${response.tracks[0].info.title}](${response.tracks[0].info.uri}) vào hàng chờ.`
                        ),
                ],
            });
        }
        if (!player.playing) await player.play({ paused: false });
    }
);
