import config from "@/config";
import type { Guild } from "@prisma/client";
import { EmbedBuilder, resolveColor } from "discord.js";

export class PremiumErrorEmbedBuilder extends EmbedBuilder {
    constructor(client: ExtendedClient, guild: Guild, reason: string) {
        super({
            color: resolveColor(client.color.main),
            description: `
            > ${reason}
            > ${client.locale(guild, "error.premium.contact", {
                ownerId: config.users.ownerId,
            })}
            `,
        });
    }
}
