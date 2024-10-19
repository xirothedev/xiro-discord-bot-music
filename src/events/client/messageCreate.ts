import config from "@/config";
import event from "@/layouts/event";
import { EmbedBuilder, Message, NewsChannel, StageChannel, TextChannel, VoiceChannel, time } from "discord.js";
import ms from "ms";
import type { Command } from "typings/command";
import { Mode } from "typings/utils";

type CooldownProps = { name: string; availableAt: string };
const cooldown = new Map<string, CooldownProps[]>();

export default event("messageCreate", { once: false }, async (client, message: Message) => {
    if (message.author.bot || !message.inGuild()) return;
    if (!client.prefix) return;

    if (!message.content.toLowerCase().startsWith(client.prefix.toLowerCase())) return;

    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const commandInput = args.shift()?.toLowerCase();
    if (!commandInput) return;

    const command: Command | undefined =
        client.collection.prefixcommands.get(commandInput) ||
        client.collection.prefixcommands.get(client.collection.aliases.get(commandInput)!);

    if (command) {
        const embed = new EmbedBuilder();

        try {
            if (command.options.ownerOnly && message.author.id !== config.users.ownerId) {
                return await message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color.red)
                            .setDescription(`❌ **|** Chỉ có chủ sở hữu bot mới có thể sử dụng lệnh này!`),
                    ],
                });
            }

            if (command.options.developersOnly && !config.users.devIds.includes(message.author.id)) {
                return await message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color.red)
                            .setDescription(`❌ **|** Chỉ có nhà phát triển bot mới có thể sử dụng lệnh này!`),
                    ],
                });
            }

            if (command.options.voiceOnly && !message.member?.voice.channel) {
                return await message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color.red)
                            .setDescription(`❌ **|** Bạn cần tham gia một kênh voice để sử dụng lệnh này!`),
                    ],
                });
            }

            if (command.options.sameRoom) {
                const player = client.manager.getPlayer(message.guildId);

                if (player?.connected && player?.voiceChannelId !== message.member?.voice.channelId) {
                    return await message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color.red)
                                .setDescription("❌ **|** Bạn phải ở cùng phòng với bot để sử dụng lệnh này."),
                        ],
                    });
                }
            }

            if (command.options.nsfw && !message.channel.isThread()) {
                const channel = message.channel as NewsChannel | StageChannel | TextChannel | VoiceChannel;
                if (!channel.nsfw) {
                    return await message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color.red)
                                .setDescription(`❌ **|** Lệnh này chỉ có thể được sử dụng trong kênh nsfw!`),
                        ],
                    });
                }
            }

            if (command.options.userPermissions) {
                if (!message.member?.permissions.has(command.options.userPermissions)) {
                    return await message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color.red)
                                .setDescription(`❌ **|** Bạn không có quyền sử dụng lệnh này!`),
                        ],
                    });
                }
            }

            if (command.options.botPermissions) {
                if (!message.guild.members.me?.permissions.has(command.options.botPermissions)) {
                    return await message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color.red)
                                .setDescription(`❌ **|** Tôi không có quyền thực hiện điều này!`),
                        ],
                    });
                }
            }

            if (
                command.options.cooldown &&
                config.users.ownerId !== message.author.id &&
                !config.users.devIds.includes(message.author.id)
            ) {
                const setCooldown = (name: string, time: string): CooldownProps => {
                    return {
                        name,
                        availableAt: (Date.now() + ms(time)).toString(),
                    };
                };

                let data: any = cooldown.get(message.author.id);
                if (data) {
                    data = data.filter(({ name }: CooldownProps) => name === commandInput);
                    data = data[0];
                    if (data?.availableAt >= Date.now()) {
                        return await message.channel.send({
                            embeds: [
                                embed
                                    .setColor(client.color.red)
                                    .setDescription(
                                        `❌ **|** Bạn đang sử dụng quá nhanh lệnh này! Thử lại lúc  ${time(
                                            Math.floor(data.availableAt / 1000),
                                            "R"
                                        )}!`
                                    ),
                            ],
                        });
                    }
                } else {
                    cooldown.set(message.author.id, [setCooldown(commandInput, command.options.cooldown)]);
                }

                setTimeout(() => {
                    let data = cooldown.get(message.author.id);

                    if (!data) return;
                    data = data.filter(({ name }: CooldownProps) => name !== commandInput);

                    if (data.length === 0) {
                        cooldown.delete(message.author.id);
                    } else {
                        cooldown.set(message.author.id, data);
                    }
                }, ms(command.options.cooldown as string));
            }

            await command.handler(client, message, args);
        } catch (error) {
            console.error(error);
        }
    }
});
