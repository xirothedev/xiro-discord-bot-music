import prefix from "@/layouts/prefix";
import { EmbedBuilder, VoiceChannel } from "discord.js";
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
            usage: "playnext [song]",
        },
        aliases: ["pn"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
        ignore: true,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const query = args.join(" ");
        const embed = new EmbedBuilder();

        if (!query) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Vui lòng cung cấp từ khóa hoặc đường dẫn.")],
            });
        }

        const memberVoiceChannel = message.member?.voice.channel as VoiceChannel;
        let player = client.manager.getPlayer(message.guildId) || client.manager.createPlayer({
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
                return msg.edit({
                    content: "",
                    embeds: [embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi khi tìm kiếm.")],
                });
            }

            const tracksToAdd = response.loadType === "playlist" ? response.tracks : [response.tracks[0]];
            await player.queue.splice(0, 0, ...tracksToAdd);  // Use spread operator to add tracks

            const embedDescription = response.loadType === "playlist"
                ? `Đã thêm ${response.tracks.length} bài hát để phát tiếp theo trong hàng chờ.`
                : `Đã thêm [${response.tracks[0].info.title}](${response.tracks[0].info.uri}) để phát tiếp theo trong hàng chờ.`;

            await msg.edit({
                content: "",
                embeds: [embed.setColor(client.color.main).setDescription(embedDescription)],
            });

            if (!player.playing) await player.play({ paused: false });
        } catch (error) {
            console.error(error);
            await msg.edit({
                content: "",
                embeds: [
                    embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi trong quá trình thêm bài hát.")
                ],
            });
        }
    },
);
