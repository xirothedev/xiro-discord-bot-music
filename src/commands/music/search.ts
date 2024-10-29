import checkPremium from "@/helpers/checkPremium";
import { PremiumErrorEmbedBuilder } from "@/interface/premium";
import prefix from "@/layouts/prefix";
import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    VoiceChannel,
} from "discord.js";
import type { SearchResult } from "lavalink-client";
import { Category } from "@/typings/utils";

export default prefix(
    "search",
    {
        description: {
            content: "Tìm kiếm một bài hát",
            examples: ["search example"],
            usage: "search [song]",
        },
        aliases: ["sc"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder().setColor(client.color.main);
        const query = args.join(" ");
        const memberVoiceChannel = message.member?.voice.channel as VoiceChannel;

        if (!query) {
            return await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Vui lòng cung cấp từ khóa.")],
            });
        }

        let player =
            client.manager.getPlayer(message.guildId) ||
            client.manager.createPlayer({
                guildId: message.guildId,
                voiceChannelId: memberVoiceChannel.id,
                textChannelId: message.channelId,
                selfMute: false,
                selfDeaf: true,
                vcRegion: memberVoiceChannel.rtcRegion!,
            });

        if (!player.connected) await player.connect();

        try {
            const response = (await player.search({ query }, message.author)) as SearchResult;

            if (!response || response.tracks.length === 0) {
                return await message.channel.send({
                    embeds: [embed.setDescription("Không tìm thấy kết quả.").setColor(client.color.red)],
                });
            }

            if (response.loadType === "search" && response.tracks.length > 0) {
                const selectMenu = new StringSelectMenuBuilder({
                    custom_id: "search_select",
                    placeholder: "Chọn một trong những bài hát dưới đây",
                });

                const trackDescriptions = response.tracks.map((track, index) => {
                    selectMenu.addOptions(
                        new StringSelectMenuOptionBuilder({
                            label: track.info.title.slice(0, 100),
                            value: index.toString(),
                            description: client.utils.formatTime(track.info.duration),
                        }),
                    );
                    return `${index + 1}. [${track.info.title}](${track.info.uri}) - \`${track.info.author}\``;
                });

                const row = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(selectMenu);
                const msg = await message.channel.send({
                    embeds: [embed.setDescription(trackDescriptions.join("\n"))],
                    components: [row],
                });

                const collector = msg.createMessageComponentCollector({
                    filter: (interaction) => interaction.user.id === message.author.id,
                    max: 1,
                    time: 60000,
                });

                collector.on("collect", async (interaction) => {
                    if (!interaction.isStringSelectMenu() || interaction.customId !== "search_select") return;

                    const track = response.tracks[parseInt(interaction.values[0])];
                    await interaction.deferUpdate();
                    if (!track) return;

                    if (!checkPremium(guild, user) && player.queue.tracks.length >= 25) {
                        return msg.edit({
                            content: "",
                            embeds: [
                                new PremiumErrorEmbedBuilder(
                                    client,
                                    "Bạn không thể thêm quá 25 bài hát vì chưa kích hoạt premium",
                                ),
                            ],
                        });
                    }

                    player.queue.add(track);
                    if (!player.playing) await player.play({ paused: false });

                    await msg.edit({
                        embeds: [
                            embed.setDescription(`Đã thêm [${track.info.title}](${track.info.uri}) vào hàng chờ.`),
                        ],
                        components: [],
                    });
                });

                collector.on("end", async () => {
                    await msg.edit({ components: [row.setComponents(selectMenu.setDisabled(true))] });
                });
            } else {
                return await message.channel.send({
                    embeds: [embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi khi tìm kiếm.")],
                });
            }
        } catch (error) {
            console.error(error);
            await message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription("Đã xảy ra lỗi trong quá trình xử lý.")],
            });
        }
    },
);
