import checkPremium from "@/helpers/checkPremium";
import { PremiumErrorEmbedBuilder } from "@/interface/premium";
import prefix from "@/layouts/prefix";
import { EmbedBuilder, type VoiceBasedChannel } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "play",
    {
        description: {
            content: "desc.play",
            examples: [
                "play example",
                "play https://www.youtube.com/watch?v=example",
                "play https://open.spotify.com/track/example",
                "play http://www.example.com/example.mp3",
            ],
            usage: "play [song]",
        },
        aliases: ["p"],
        cooldown: "5s",
        voiceOnly: true,
        sameRoom: true,
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
        ignore: false,
        category: Category.music,
    },
    async (client, guild, user, message, args) => {
        const query = args.join(" ");
        const embed = new EmbedBuilder();

        if (!query) {
            return message.channel.send({
                embeds: [embed.setColor(client.color.red).setDescription(client.locale(guild, "error.no_query"))],
            });
        }

        const msg = await message.channel.send(client.locale(guild, "use_many.searching"));
        const memberVoiceChannel = message.member?.voice.channel as VoiceBasedChannel;

        // Get or create player
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
            const response = await player.search({ query }, message.author);

            if (!response || response.tracks?.length === 0) {
                return msg.edit({
                    content: "",
                    embeds: [embed.setColor(client.color.red).setDescription(client.locale(guild, "error.no_result"))],
                });
            }

            const tracksToAdd = response.loadType === "playlist" ? response.tracks : [response.tracks[0]];

            if (!checkPremium(guild, user) && tracksToAdd.length > 25) {
                return msg.edit({
                    content: "",
                    embeds: [new PremiumErrorEmbedBuilder(client, guild,client.locale(guild, "error.premium.limit_tracks"))],
                });
            }

            await player.queue.add(tracksToAdd);

            const embedDescription =
                response.loadType === "playlist"
                    ? client.locale(guild, "success.added.track", { amount: response.tracks.length })
                    : client.locale(guild, "success.added.queue", {
                          title: response.tracks[0].info.title,
                          uri: response.tracks[0].info.uri,
                      });

            await msg.edit({
                content: "",
                embeds: [embed.setColor(client.color.main).setDescription(embedDescription)],
            });

            if (!player.playing) await player.play({ paused: false });
        } catch (error) {
            console.error(error);
            await msg.edit({
                content: "",
                embeds: [embed.setColor(client.color.red).setDescription(client.locale(guild, "error.error"))],
            });
        }
    },
);
