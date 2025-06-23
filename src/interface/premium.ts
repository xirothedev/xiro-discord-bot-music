import config from "@/config";
import type { Guild } from "prisma/generated";
import { EmbedBuilder, resolveColor } from "discord.js";
import { T } from "@/handlers/i18n";

export class PremiumErrorEmbedBuilder extends EmbedBuilder {
    constructor(client: ExtendedClient, guild: Guild, reason: string) {
        super({
            color: resolveColor(client.color.main),
            description: `
            > ${reason}
            > ${T(guild.language, "error.premium.contact", {
                ownerId: config.users.ownerId,
            })}
            `,
        });
    }
}
