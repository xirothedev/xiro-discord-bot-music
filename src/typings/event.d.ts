import type { ClientEvents } from "discord.js";
import type { LavalinkManagerEvents, NodeManagerEvents } from "lavalink-client";

export interface EventOptions {
    once: boolean;
    ignore?: boolean;
}

export interface Event {
    name: string;
    options: EventOptions;
    handler: (client: ExtendedClient, ...args: any[]) => void;
}

export interface CustomClientEvents {
    setupSystem: (message: Message) => void;
    setupButtons: (interaction: ButtonInteraction) => void;
}

export type AllEvents = LavalinkManagerEvents & NodeManagerEvents & ClientEvents;
