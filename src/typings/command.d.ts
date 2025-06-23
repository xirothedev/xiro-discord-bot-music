import type { Guild } from "prisma/generated";
import type { Message, PermissionResolvable } from "discord.js";
import type { FullUser } from "@/typings";
import type { Category } from "./utils";

interface PrefixOptions {
    description: {
        content: string;
        usage: string;
        examples: string[];
    };
    premium?: boolean;
    booster?: boolean;
    aliases?: string[];
    category: Category;
    voiceOnly?: boolean;
    specialRole?: "dev" | "owner";
    premium?: boolean;
    ignore?: boolean;
    nsfw?: boolean;
    hidden?: boolean;
    cooldown?: string;
    sameRoom?: boolean;
    userPermissions?: PermissionResolvable[] | null;
    botPermissions?: PermissionResolvable[] | null;
}

export interface Command {
    name: string;
    options: PrefixOptions;
    handler: (
        client: ExtendedClient,
        guild: Guild,
        user: FullUser,
        message: Message<true>,
        args: string[],
    ) => void;
}
