import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { Player } from "lavalink-client";

export function createButtonRow(
    player: Player,
    client: ExtendedClient,
): ActionRowBuilder<ButtonBuilder>[] {
    const previousButton = new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji(client.emoji.previous)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!player.queue.previous);

    const resumeButton = new ButtonBuilder()
        .setCustomId("resume")
        .setEmoji(player.paused ? client.emoji.resume : client.emoji.pause)
        .setStyle(player.paused ? ButtonStyle.Success : ButtonStyle.Secondary);

    const stopButton = new ButtonBuilder()
        .setCustomId("stop")
        .setEmoji(client.emoji.stop)
        .setStyle(ButtonStyle.Danger);

    const skipButton = new ButtonBuilder()
        .setCustomId("skip")
        .setEmoji(client.emoji.skip)
        .setStyle(ButtonStyle.Secondary);

    const loopButton = new ButtonBuilder()
        .setCustomId("loop")
        .setEmoji(
            player.repeatMode === "track"
                ? client.emoji.loop.track
                : client.emoji.loop.none,
        )
        .setStyle(
            player.repeatMode !== "off" ? ButtonStyle.Success : ButtonStyle.Secondary,
        );
    const shuffle = new ButtonBuilder()
        .setCustomId("shuffle")
        .setEmoji(client.emoji.page.shuffle)
        .setStyle(ButtonStyle.Secondary);

    const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        previousButton,
        stopButton,
        skipButton,
    );
    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        shuffle,
        resumeButton,
        loopButton,
    );

    return [row1, row2];
}
