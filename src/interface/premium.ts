import config from "@/config";
import { EmbedBuilder, resolveColor } from "discord.js";

export class PremiumErrorEmbedBuilder extends EmbedBuilder {
    constructor(client: ExtendedClient, reason: string) {
        super({
            color: resolveColor(client.color.main),
            description: `
            > ${reason}
            > Để kích hoạt premium bot, bạn có thể liên hệ với <@${config.users.ownerId}> nhé!
            `,
        });
    }
}
