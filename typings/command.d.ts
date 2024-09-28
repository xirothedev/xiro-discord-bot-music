import type { Embed, Message, PermissionResolvable } from "discord.js";
import type { Category } from "./utils";

interface PrefixOptions {
    description: {
        content: string;
        usage: string;
        examples: string[];
    };
    aliases?: string[];
    category: Category;
    voiceOnly?: boolean;
    developersOnly?: boolean;
    ownerOnly?: boolean;
    ignore?: boolean;
    nsfw?: boolean;
    hidden?: boolean;
    cooldown?: string;
    userPermissions?: PermissionResolvable[] | null;
    botPermissions?: PermissionResolvable[] | null;
}

export interface Command {
    name: string;
    options: PrefixOptions;
    handler: (client: ExtendedClient, message: Message<true>, args: string[]) => void;
}
