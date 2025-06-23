import type { Guild } from "prisma/generated";
import type { Message } from "discord.js";
import type { FullUser } from "@/typings";
import type { PrefixOptions } from "@/typings/command";
const prefix = (
    name: string,
    options: PrefixOptions,
    handler: (
        client: ExtendedClient,
        guild: Guild,
        user: FullUser,
        message: Message<true>,
        args: string[],
    ) => void,
) => ({
    name,
    options,
    handler,
});

export default prefix;
