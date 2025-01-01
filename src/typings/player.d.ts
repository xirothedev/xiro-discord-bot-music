import type { EQBand, FilterData, PlayerOptions, RepeatMode } from "lavalink-client";

interface Requester {
    id: string;
    username: string;
    discriminator?: string;
    avatarURL?: string;
}

export interface PlayerJson {
    guildId: string;
    options: PlayerOptions;
    voiceChannelId: string;
    textChannelId?: string;
    position: number;
    lastPosition: number;
    volume: number;
    lavalinkVolume: number;
    repeatMode: RepeatMode;
    paused: boolean;
    playing: boolean;
    createdTimeStamp?: number;
    filters: FilterData;
    ping: {
        ws: number;
        lavalink: number;
    };
    equalizer: EQBand[];
    nodeId?: string;
}
