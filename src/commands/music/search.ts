import prefix from "@/layouts/prefix";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    VoiceChannel,
} from "discord.js";
import type { SearchResult, Track } from "lavalink-client";
import { Category } from "typings/utils";

export default prefix(
    "search",
    {
        description: {
            content: "Tìm kiếm một bài hát",
            examples: ["search example"],
            usage: "search <song>",
        },
        beta: true,
        aliases: ["sc"],
        cooldown: "5s",
        voiceOnly: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color.main);
        let player = client.manager.getPlayer(message.guildId);
        const query = args.join(" ");
        const memberVoiceChannel = message.member?.voice.channel as VoiceChannel;

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
        const response = (await player.search({ query: query }, message.author)) as SearchResult;
        if (!response || response.tracks?.length === 0) {
            return await message.channel.send({
                embeds: [embed.setDescription("Không tìm thấy kết quả.").setColor(client.color.red)],
            });
        }

        if (response.loadType === "search" && response.tracks.length > 2) {
            const select = new StringSelectMenuBuilder({
                custom_id: "search_select",
                placeholder: "Chọn một trong những bài hát dưới đây",
            });

            const tracks: string[] = [];

            response.tracks.forEach((track, index) => {
                select.addOptions(
                    new StringSelectMenuOptionBuilder({
                        label: track.info.title.slice(0, 100),
                        value: index.toString(),
                        description: client.utils.formatTime(track.info.duration),
                    })
                );

                tracks.push(`${index + 1}. [${track.info.title}](${track.info.uri}) - \`${track.info.author}\``);
            });

            const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(select);
            const msg = await message.channel.send({
                embeds: [embed.setDescription(tracks.join("\n"))],
                components: [row],
            });

            const collector = msg.channel.createMessageComponentCollector({
                filter: (f) => f.user.id === message.author.id,
                max: 1,
                time: 60000,
                idle: 60000 / 2,
            });
            collector.on("collect", async (i) => {
                if (i.customId !== "search_select" || !i.isStringSelectMenu()) return;
                const track = response.tracks[parseInt(i.values[0])];
                await i.deferUpdate();
                if (!track) return;
                player.queue.add(track);
                if (!player.playing) await player.play({ paused: false });
                await msg.edit({
                    embeds: [embed.setDescription(`Đã thêm [${track.info.title}](${track.info.uri}) vào hàng chờ.`)],
                    components: [],
                });
                return collector.stop();
            });
            collector.on("end", async () => {
                await msg.edit({ components: [] });
            });
        } else {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi khi tìm kiếm.")],
            });
        }
    }
);
