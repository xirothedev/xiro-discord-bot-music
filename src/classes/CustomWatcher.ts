import type { QueueChangesWatcher, Track, UnresolvedTrack } from "lavalink-client";

export class CustomWatcher implements QueueChangesWatcher {
    constructor(private client: ExtendedClient) {}
    shuffled(guildId: string) {
        console.log(
            `${this.client.guilds.cache.get(guildId)?.name || guildId}: Queue got shuffled`,
        );
    }
    tracksAdd(
        guildId: string,
        tracks: (Track | UnresolvedTrack)[],
        position: number | number[],
    ) {
        console.log(
            `${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got added into the Queue at position #${position}`,
        );
    }
    tracksRemoved(
        guildId: string,
        tracks: (Track | UnresolvedTrack)[],
        position: number | number[],
    ) {
        console.log(
            `${this.client.guilds.cache.get(guildId)?.name || guildId}: ${tracks.length} Tracks got removed from the Queue at position #${position}`,
        );
    }
}
