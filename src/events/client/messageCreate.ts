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

type CooldownProps = { 
    name: string; 
    userId: string; 
    availableAt: string;
    messageId?: string;
    channelId?: string;
};

const cooldown = new Map<string, CooldownProps[]>();

async function sendAutoDeleteMessage(channel: TextChannel | NewsChannel | VoiceChannel, options: { embeds?: EmbedBuilder[], content?: string }, deleteAfter: number = 10000) {
    try {
        const sentMessage = await channel.send(options);
        setTimeout(() => {
            sentMessage.delete().catch(console.error);
        }, deleteAfter);
        return sentMessage;
    } catch (error) {
        console.error('Error sending or deleting message:', error);
        return null;
    }
}

export default event("messageCreate", { once: false }, async (client, message: Message) => {
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
        client.collection.prefixcommands.get(client.collection.aliases.get(commandInput)!);

    if (command) {
        const embed = new EmbedBuilder();

        try {
            const guild = await client.prisma.guild.upsert({
                where: { guildId: message.guildId },
                update: {}, 
                create: { guildId: message.guildId },
            });

            let user;
            try {
                user = await client.prisma.user.findUnique({
                    where: { userId: message.author.id },
                    include: { playlists: { include: { tracks: true } } }
                });

                if (!user) {
                    user = await client.prisma.user.create({
                        data: { userId: message.author.id },
                        include: { playlists: { include: { tracks: true } } }
                    });
                }
            } catch (userError) {
                console.error('User retrieval/creation error:', userError);
                
                user = { 
                    userId: message.author.id, 
                    playlists: [],
                    premiumFrom: null,
                    premiumTo: null,
                    premiumPlan: []
                };
            }

            if (command.options.specialRole === "owner" && message.author.id !== config.users.ownerId) {
                return await sendAutoDeleteMessage(message.channel as TextChannel, {
                    embeds: [
                        embed.setColor(client.color.red).setDescription(client.locale(guild, "handler.owner_only")),
                    ]
                });
            }

            if (command.options.specialRole === "dev" && !config.users.devIds.includes(message.author.id)) {
                return await sendAutoDeleteMessage(message.channel as TextChannel, {
                    embeds: [embed.setColor(client.color.red).setDescription(client.locale(guild, "handler.dev_only"))]
                });
            }

            if (command.options.voiceOnly && !message.member?.voice.channel) {
                return await sendAutoDeleteMessage(message.channel as TextChannel, {
                    embeds: [
                        embed.setColor(client.color.red).setDescription(client.locale(guild, "handler.voice_only")),
                    ]
                });
            }

            if (command.options.sameRoom) {
                const player = client.manager.getPlayer(message.guildId);

                if (player?.connected && player?.voiceChannelId !== message.member?.voice.channelId) {
                    return await sendAutoDeleteMessage(message.channel as TextChannel, {
                        embeds: [
                            embed.setColor(client.color.red).setDescription(client.locale(guild, "handler.same_room")),
                        ]
                    });
                }
            }

            if (command.options.nsfw && !message.channel.isThread()) {
                const channel = message.channel as NewsChannel | StageChannel | TextChannel | VoiceChannel;
                if (!channel.nsfw) {
                    return await sendAutoDeleteMessage(message.channel as TextChannel, {
                        embeds: [
                            embed.setColor(client.color.red).setDescription(client.locale(guild, "handler.nsfw_only")),
                        ]
                    });
                }
            }

            if (command.options.userPermissions && !message.member?.permissions.has(command.options.userPermissions)) {
                return sendAutoDeleteMessage(message.channel as TextChannel, {
                    embeds: [embed.setDescription(client.locale(guild, "handler.no_permission"))]
                });
            }

            if (
                command.options.botPermissions &&
                !message.guild.members.me?.permissions.has(command.options.botPermissions)
            ) {
                return sendAutoDeleteMessage(message.channel as TextChannel, {
                    embeds: [embed.setDescription(client.locale(guild, "handler.bot_no_permission"))]
                });
            }

            if (command.options.premium && !checkPremium) {
                return sendAutoDeleteMessage(message.channel as TextChannel, {
                    embeds: [new PremiumErrorEmbedBuilder(client, guild, client.locale(guild, "handler.premium"))]
                });
            }

            if (
                command.options.cooldown &&
                config.users.ownerId !== message.author.id &&
                !config.users.devIds.includes(message.author.id)
            ) {
                const currentTimestamp = Date.now();
                const cooldownTime = ms(command.options.cooldown as string);

                const commandCooldowns = cooldown.get(commandInput) || [];
                
                const existingCooldown = commandCooldowns.find(
                    cd => cd.userId === message.author.id && cd.name === commandInput
                );

                if (existingCooldown && parseInt(existingCooldown.availableAt) >= currentTimestamp) {
                    if (existingCooldown.messageId && existingCooldown.channelId) {
                        try {
                            const channel = await client.channels.fetch(existingCooldown.channelId);
                            if (channel && channel.isTextBased()) {
                                await channel.messages.delete(existingCooldown.messageId);
                            }
                        } catch (error) {
                            console.error('Error deleting existing cooldown message:', error);
                        }
                    }

                    const cooldownMessage = await message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color.red)
                                .setDescription(
                                    client.locale(guild, "handler.cooldown", {
                                        time: time(Math.floor(parseInt(existingCooldown.availableAt) / 1000), "R"),
                                        command: commandInput
                                    })
                                ),
                        ]
                    });

                    existingCooldown.messageId = cooldownMessage.id;
                    existingCooldown.channelId = cooldownMessage.channelId;

                    return;
                }

                const newCooldown: CooldownProps = {
                    name: commandInput,
                    userId: message.author.id,
                    availableAt: (currentTimestamp + cooldownTime).toString(),
                };

                const updatedCooldowns = commandCooldowns.filter(
                    cd => cd.userId !== message.author.id || cd.name !== commandInput
                );
                updatedCooldowns.push(newCooldown);
                cooldown.set(commandInput, updatedCooldowns);

                setTimeout(async () => {
                    const currentCooldowns = cooldown.get(commandInput) || [];
                    const remainingCooldowns = currentCooldowns.filter(
                        cd => parseInt(cd.availableAt) > Date.now()
                    );
                    
                    const expiredCooldown = currentCooldowns.find(
                        cd => cd.userId === message.author.id && cd.name === commandInput
                    );

                    if (expiredCooldown && expiredCooldown.messageId && expiredCooldown.channelId) {
                        try {
                            const channel = await client.channels.fetch(expiredCooldown.channelId);
                            if (channel && channel.isTextBased()) {
                                await channel.messages.delete(expiredCooldown.messageId);
                            }
                        } catch (error) {
                            console.error('Error deleting cooldown message:', error);
                        }
                    }
                    
                    if (remainingCooldowns.length === 0) {
                        cooldown.delete(commandInput);
                    } else {
                        cooldown.set(commandInput, remainingCooldowns);
                    }
                }, cooldownTime);
            }

            command.handler(client, guild, user, message, args);
        } catch (error) {
            console.error(error);
        }
    }
});