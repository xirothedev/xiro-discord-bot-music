import {
    ActionRowBuilder,
    ActivityType,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    CommandInteraction,
    GuildMember,
    Message,
    User,
    type Interaction,
    type TextChannel,
} from "discord.js";

export class Utils {
    public formatTime(ms: number): string {
        const minuteMs = 60 * 1000;
        const hourMs = 60 * minuteMs;
        const dayMs = 24 * hourMs;
        if (ms < minuteMs) return `${ms / 1000}s`;
        if (ms < hourMs) return `${Math.floor(ms / minuteMs)}m ${Math.floor((ms % minuteMs) / 1000)}s`;
        if (ms < dayMs) return `${Math.floor(ms / hourMs)}h ${Math.floor((ms % hourMs) / minuteMs)}m`;
        return `${Math.floor(ms / dayMs)}d ${Math.floor((ms % dayMs) / hourMs)}h`;
    }

    public updateStatus(client: ExtendedClient, guildId?: string): void {
        const { user } = client;
        if (user && guildId === process.env.GUILD_ID) {
            const player = client.manager.getPlayer(process.env.GUILD_ID);
            user.setPresence({
                activities: [
                    {
                        name: player?.queue?.current
                            ? `🎶 | ${player.queue?.current.info.title}`
                            : `Sử dụng lệnh ${client.prefix}help để biết thêm chi tiết`,
                        type: player?.queue?.current ? ActivityType.Listening : ActivityType.Streaming,
                    },
                ],
                status: "online",
            });
        }
    }

    public chunk(array: any[], size: number) {
        const chunked_arr: any[][] = [];
        for (let index = 0; index < array.length; index += size) {
            chunked_arr.push(array.slice(index, size + index));
        }
        return chunked_arr;
    }

    public formatBytes(bytes: number, decimals = 2): string {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
    }

    public formatNumber(number: number): string {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    public parseTime(string: string): number {
        const time = string.match(/([0-9]+[d,h,m,s])/g);
        if (!time) return 0;
        let ms = 0;
        for (const t of time) {
            const unit = t[t.length - 1];
            const amount = Number(t.slice(0, -1));
            if (unit === "d") ms += amount * 24 * 60 * 60 * 1000;
            else if (unit === "h") ms += amount * 60 * 60 * 1000;
            else if (unit === "m") ms += amount * 60 * 1000;
            else if (unit === "s") ms += amount * 1000;
        }
        return ms;
    }

    public progressBar(current: number, total: number, size = 20): string {
        const percent = Math.round((current / total) * 100);
        const filledSize = Math.round((size * current) / total);
        const filledBar = "▓".repeat(filledSize);
        const emptyBar = "░".repeat(size - filledSize);
        return `${filledBar}${emptyBar} ${percent}%`;
    }

    public async paginate(
        client: ExtendedClient,
        ctx: ChatInputCommandInteraction | Message,
        embed: any[]
    ): Promise<void> {
        if (embed.length < 2) {
            if (ctx instanceof ChatInputCommandInteraction) {
                ctx.deferred ? ctx.followUp({ embeds: embed }) : ctx.reply({ embeds: embed });
                return;
            }

            (ctx.channel as TextChannel).send({ embeds: embed });
            return;
        }

        let page = 0;
        const getButton = (page: number): any => {
            const firstEmbed = page === 0;
            const lastEmbed = page === embed.length - 1;
            const pageEmbed = embed[page];
            const first = new ButtonBuilder()
                .setCustomId("first")
                .setEmoji(client.emoji.page.first)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(firstEmbed);
            const back = new ButtonBuilder()
                .setCustomId("back")
                .setEmoji(client.emoji.page.back)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(firstEmbed);
            const next = new ButtonBuilder()
                .setCustomId("next")
                .setEmoji(client.emoji.page.next)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(lastEmbed);
            const last = new ButtonBuilder()
                .setCustomId("last")
                .setEmoji(client.emoji.page.last)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(lastEmbed);
            const stop = new ButtonBuilder()
                .setCustomId("stop")
                .setEmoji(client.emoji.page.cancel)
                .setStyle(ButtonStyle.Danger);
                const row = new ActionRowBuilder().setComponents(first, back, stop, next, last);
                return { embeds: [pageEmbed], components: [row] };
        };

        const msgOptions = getButton(0);
        const msg =
            ctx instanceof ChatInputCommandInteraction
                ? await (ctx.deferred
                      ? ctx.followUp({
                            ...msgOptions,
                            fetchReply: true as boolean,
                        })
                      : ctx.reply({ ...msgOptions, fetchReply: true }))
                : await (ctx.channel as TextChannel).send({
                      ...msgOptions,
                      fetchReply: true,
                  });

        const author = ctx instanceof CommandInteraction ? ctx.user : ctx.author;

        const filter = (int: any): any => int.user.id === author?.id;
        const collector = msg.createMessageComponentCollector({
            filter,
            time: 60000,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.user.id === author?.id) {
                await interaction.deferUpdate();
                if (interaction.customId === "first" && page !== 0) {
                    page = 0;
                } else if (interaction.customId === "back" && page !== 0) {
                    page--;
                } else if (interaction.customId === "stop") {
                    collector.stop();
                } else if (interaction.customId === "next" && page !== embed.length - 1) {
                    page++;
                } else if (interaction.customId === "last" && page !== embed.length - 1) {
                    page = embed.length - 1;
                }
                await interaction.editReply(getButton(page));
            } else {
                await interaction.reply({
                    content: "Bạn không thể sử dụng nút này.",
                    ephemeral: true,
                });
            }
        });

        collector.on("end", async () => {
            await msg.edit({ embeds: [embed[page]], components: [] });
        });
    }

    public async createLog(client: ExtendedClient, message: string, createIn?: string, user?: User | GuildMember) {
        return await client.prisma.logger.create({
            data: { message, createBy: user?.id, createIn },
        });
    }
}
