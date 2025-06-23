import config from "@/config";
import event from "@/layouts/event";
import {
    EmbedBuilder,
    Message,
    NewsChannel,
    StageChannel,
    TextChannel,
    VoiceChannel,
    time,
    userMention,
} from "discord.js";
import ms from "ms";
import type { Command } from "@/typings/command";
import checkPremium from "@/helpers/checkPremium";
import { PremiumErrorEmbedBuilder } from "@/interface/premium";
import { T } from "@/handlers/i18n";

type CooldownProps = { name: string; availableAt: string };
const cooldown = new Map<string, CooldownProps[]>();

export default event(
    "messageCreate",
    { once: false },
    async (client, message: Message) => {
        if (message.author.bot || !message.inGuild()) return;
        if (!client.prefix) return;

        let prefix: string;

        if (message.content.toLowerCase().startsWith(client.prefix.toLowerCase())) {
            prefix = client.prefix;
        } else if (message.content.startsWith(userMention(client.user.id))) {
            prefix = userMention(client.user.id);
        } else {
            return;
        }

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandInput = args.shift()?.toLowerCase();
        if (!commandInput) return;

        const command: Command | undefined =
            client.collection.prefixcommands.get(commandInput) ||
            client.collection.prefixcommands.get(
                client.collection.aliases.get(commandInput)!,
            );

        if (command) {
            const embed = new EmbedBuilder();

            try {
                const guild = await client.prisma.guild.upsert({
                    where: { guildId: message.guildId },
                    create: { guildId: message.guildId },
                    update: {},
                });

                const user = await client.prisma.user.upsert({
                    where: { userId: message.author.id },
                    create: { userId: message.author.id },
                    include: { playlists: { include: { tracks: true } } },
                    update: {},
                });

                if (
                    command.options.specialRole === "owner" &&
                    message.author.id !== config.users.ownerId
                ) {
                    return await message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color.red)
                                .setDescription(T(guild.language, "handler.owner_only")),
                        ],
                    });
                }

                if (
                    command.options.specialRole === "dev" &&
                    !config.users.devIds.includes(message.author.id)
                ) {
                    return await message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color.red)
                                .setDescription(T(guild.language, "handler.dev_only")),
                        ],
                    });
                }

                if (command.options.voiceOnly && !message.member?.voice.channel) {
                    return await message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color.red)
                                .setDescription(T(guild.language, "handler.voice_only")),
                        ],
                    });
                }

                if (command.options.sameRoom) {
                    const player = client.manager.getPlayer(message.guildId);

                    if (
                        player?.connected &&
                        player?.voiceChannelId !== message.member?.voice.channelId
                    ) {
                        return await message.channel.send({
                            embeds: [
                                embed
                                    .setColor(client.color.red)
                                    .setDescription(
                                        T(guild.language, "handler.same_room"),
                                    ),
                            ],
                        });
                    }
                }

                if (command.options.nsfw && !message.channel.isThread()) {
                    const channel = message.channel as
                        | NewsChannel
                        | StageChannel
                        | TextChannel
                        | VoiceChannel;
                    if (!channel.nsfw) {
                        return await message.channel.send({
                            embeds: [
                                embed
                                    .setColor(client.color.red)
                                    .setDescription(
                                        T(guild.language, "handler.nsfw_only"),
                                    ),
                            ],
                        });
                    }
                }

                if (
                    command.options.userPermissions &&
                    !message.member?.permissions.has(command.options.userPermissions)
                ) {
                    return message.channel.send({
                        embeds: [
                            embed.setDescription(
                                T(guild.language, "handler.no_permission"),
                            ),
                        ],
                    });
                }

                if (
                    command.options.botPermissions &&
                    !message.guild.members.me?.permissions.has(
                        command.options.botPermissions,
                    )
                ) {
                    return message.channel.send({
                        embeds: [
                            embed.setDescription(
                                T(guild.language, "handler.bot_no_permission"),
                            ),
                        ],
                    });
                }

                if (command.options.premium && !checkPremium) {
                    return message.channel.send({
                        embeds: [
                            new PremiumErrorEmbedBuilder(
                                client,
                                guild,
                                T(guild.language, "handler.premium"),
                            ),
                        ],
                    });
                }

                if (
                    command.options.cooldown &&
                    config.users.ownerId !== message.author.id &&
                    !config.users.devIds.includes(message.author.id)
                ) {
                    const currentTimestamp = Date.now();
                    const cooldownTime = ms(command.options.cooldown as string);

                    const userCooldowns = cooldown.get(message.author.id) || [];
                    const existingCooldown = userCooldowns.find(
                        ({ name }) => name === commandInput,
                    );

                    if (
                        existingCooldown &&
                        parseInt(existingCooldown.availableAt) >= currentTimestamp
                    ) {
                        return await message.channel.send({
                            embeds: [
                                embed.setColor(client.color.red).setDescription(
                                    T(guild.language, "handler.cooldown", {
                                        time: time(
                                            Math.floor(
                                                parseInt(existingCooldown.availableAt) /
                                                    1000,
                                            ),
                                            "R",
                                        ),
                                    }),
                                ),
                            ],
                        });
                    }

                    const newCooldown: CooldownProps = {
                        name: commandInput,
                        availableAt: (currentTimestamp + cooldownTime).toString(),
                    };

                    const updatedCooldowns = userCooldowns.filter(
                        ({ name }) => name !== commandInput,
                    );
                    updatedCooldowns.push(newCooldown);
                    cooldown.set(message.author.id, updatedCooldowns);

                    setTimeout(() => {
                        const currentCooldowns = cooldown.get(message.author.id) || [];
                        const remainingCooldowns = currentCooldowns.filter(
                            ({ availableAt }) => parseInt(availableAt) > Date.now(),
                        );
                        if (remainingCooldowns.length === 0) {
                            cooldown.delete(message.author.id);
                        } else {
                            cooldown.set(message.author.id, remainingCooldowns);
                        }
                    }, cooldownTime);
                }

                command.handler(client, guild, user, message, args);
            } catch (error) {
                console.error(error);
            }
        }
    },
);
