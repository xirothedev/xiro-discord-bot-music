import checkPremium from "@/helpers/checkPremium";
import { PremiumErrorEmbedBuilder } from "@/interface/premium";
import prefix from "@/layouts/prefix";
import { EmbedBuilder } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "load",
    {
        description: {
            content: "Sử dụng playlist.",
            examples: ["load piano"],
            usage: "load [tên playlist]",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.playlist,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const playlistName = args[0];

        if (!playlistName) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Vui lòng cung cấp tên playlist.")],
            });
        }

        const playlistData = user.playlists.find((f) => f.name === playlistName);

        if (!playlistData) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Không tìm thấy playlist.")],
            });
        }

        if (!checkPremium(guild, user)) {
            const limitedPlaylists = user.playlists.slice(0, 2);
            const limitPlaylistData = limitedPlaylists.find((f) => f.name === playlistName);

            if (!limitPlaylistData) {
                return message.channel.send({
                    embeds: [new PremiumErrorEmbedBuilder(client, "Bạn không thể sử dụng playlist số 3 trở đi")],
                });
            }
        }

        if (playlistData.tracks.length === 0) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Playlist trống.")],
            });
        }

        let player = client.manager.getPlayer(message.guildId);

        if (!player) {
            player = client.manager.createPlayer({
                guildId: message.guildId,
                voiceChannelId: message.member?.voice.channelId!,
                textChannelId: message.channelId,
                selfMute: false,
                selfDeaf: true,
                vcRegion: message.member?.voice.channel?.rtcRegion!,
            });

            if (!player.connected) await player.connect();
        }

        const nodes = client.manager.nodeManager.leastUsedNodes();
        const node = nodes[Math.floor(Math.random() * nodes.length)];

        const tracks = await node.decode.multipleTracks(
            playlistData.tracks.map((e) => e.encode),
            message.author,
        );

        if (tracks.length === 0) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Không thể tải bài hát từ playlist.")],
            });
        }

        player.queue.add(checkPremium(guild, user) ? tracks : tracks.slice(0, 25));

        if (!player.playing) await player.play({ paused: false });

        return message.channel.send({
            embeds: [
                embed
                    .setDescription(
                        `Đã tải playlist \`${playlistData.name}\` với \`${playlistData.tracks.length}\` bài hát.`,
                    )
                    .setColor(client.color.main),
            ],
        });
    },
);
