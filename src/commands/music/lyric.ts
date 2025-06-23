import prefix from "@/layouts/prefix";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Message,
} from "discord.js";
import { Category } from "@/typings/utils";
import axios from "axios";
import * as cheerio from "cheerio";
import _ from "lodash";
import { T } from "@/handlers/i18n";

export default prefix(
    "lyric",
    {
        description: {
            content: "desc.lyric",
            examples: ["lyric", "lyric attention"],
            usage: "lyric (song name)",
        },
        aliases: ["ly"],
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
    async (client, guild, user, message, args) => {
        const embed = new EmbedBuilder();
        const player = client.manager.getPlayer(message.guildId);

        const currentTrack = player.queue.current!;
        const trackTitle =
            args.length > 0
                ? args.join(" ")
                : currentTrack.info.title.trim().toLowerCase();

        const msg = await message.channel.send(T(guild.language, "use_many.searching"));

        try {
            const data = await getLyricsArray(trackTitle);

            if (data) {
                let currentPage = 0;

                const prev = new ButtonBuilder()
                    .setCustomId("prev")
                    .setEmoji(client.emoji.page.back)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true);

                const next = new ButtonBuilder()
                    .setCustomId("next")
                    .setEmoji(client.emoji.page.next)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(data.lyrics.length <= 1);

                const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
                    prev,
                    next,
                );

                await msg.edit({
                    embeds: [
                        embed
                            .setAuthor({
                                name: trackTitle,
                                iconURL: client.user.displayAvatarURL(),
                            })
                            .setDescription(`**${data.lyrics[currentPage]}**`)
                            .setThumbnail(data.thumbnail)
                            .setFooter({
                                iconURL: message.author.displayAvatarURL(),
                                text: `@${message.author.username}`,
                            })
                            .setColor(client.color.main)
                            .setTimestamp(),
                    ],
                    components: [row],
                });

                const collector = await msg.createMessageComponentCollector({
                    filter: (f) => f.user.id === message.author.id,
                    time: 60000,
                });

                collector.on("collect", async (interaction) => {
                    if (interaction.customId === "prev") {
                        currentPage--;
                    } else if (interaction.customId === "next") {
                        currentPage++;
                    }

                    await interaction.update({
                        embeds: [
                            embed
                                .setDescription(`**${data.lyrics[currentPage]}**`)
                                .setTimestamp(),
                        ],
                        components: [
                            row.setComponents(
                                prev.setDisabled(currentPage === 0),
                                next.setDisabled(currentPage === data.lyrics.length - 1),
                            ),
                        ],
                    });
                    return;
                });

                collector.on("end", () => {
                    return msg.edit({
                        components: [
                            row.setComponents(
                                prev.setDisabled(true),
                                next.setDisabled(true),
                            ),
                        ],
                    });
                });
            } else {
                await msg.edit({
                    content: "",
                    embeds: [
                        embed
                            .setColor(client.color.red)
                            .setDescription(T(guild.language, "error.no_result")),
                    ],
                });
            }
        } catch (error) {
            console.error(error);
            await msg.edit({
                content: "",
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(T(guild.language, "error.common.error")),
                ],
            });
        }
    },
);

const getSongs = async (songTitle: string) => {
    const apiUrl = `https://api.genius.com/search?q=${encodeURIComponent(songTitle)}`;
    const response = await axios.get(apiUrl, {
        headers: {
            Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
        },
    });

    const data = response.data.response.hits;

    if (!data || data.length <= 0) {
        return null;
    }

    return data[0].result;
};

const getLyricsArray = async (songTitle: string) => {
    const songData = await getSongs(songTitle);

    if (!songData) {
        return null;
    }

    const { data } = await axios.get(songData.url);
    const $ = cheerio.load(data);

    const lyricsArray: string[] = [];

    $('div[data-lyrics-container="true"]').each((i, elem) => {
        const lyricLines = $(elem).text();

        lyricsArray.push(
            _.join(
                _.split(lyricLines, /(?=\[)/).map((line: string) =>
                    line.replace(/(\[.*?\])/g, "$1\n").trim(),
                ),
                "\n\n",
            ),
        );
    });

    return {
        lyrics: lyricsArray,
        thumbnail: songData.header_image_url,
    };
};
