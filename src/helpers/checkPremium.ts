import type { FullUser } from "@/typings";
import type { Guild } from "prisma/generated";

function checkPremium(guild: Guild, user: FullUser) {
    const currentDateTime = Date.now();

    if (guild.premiumTo && currentDateTime < guild.premiumTo.getTime()) {
        return true;
    } else if (user.premiumTo && currentDateTime < user.premiumTo.getTime()) {
        return true;
    }

    return false;
}

export default checkPremium;
