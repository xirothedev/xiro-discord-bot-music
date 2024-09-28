import type { Message } from "discord.js";
import type { PrefixOptions } from "typings/command";
const prefix = (
    name: string,
    options: PrefixOptions,
    handler: (client: ExtendedClient, message: Message<true>, args: string[]) => void
) => ({
    name,
    options,
    handler,
});

export default prefix;
