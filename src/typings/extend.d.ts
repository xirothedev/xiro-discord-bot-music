import type { Client, User } from "discord.js";
import type { RedisClientType } from "redis";

export interface ExtendedClient extends Client {
    redis: RedisClientType;
}

export interface TrackRequester {
    id: string;
    username: string;
    avatarURL: string;
}

export interface QueueData {
    tracks: {
        title: string;
        uri: string;
        duration: number;
        requester: TrackRequester;
        thumbnail?: string;
        author: string;
    }[];
    position: number;
    volume: number;
    repeatMode?: "off" | "track" | "queue";
    paused?: boolean;
}
