import type { Guild } from "@prisma/client";
import type { FullUser } from "typings";

function checkPremium(guild: Guild, user: FullUser) {
    if (user?.premiumKey) {
        return true;
    }

    const currentDateTime = Date.now();

    if (guild.premiumTo && currentDateTime < guild.premiumTo.getTime()) {
        return true;
    } else if (user.premiumTo && currentDateTime < user.premiumTo.getTime()) {
        return true;
    }

    return false;
}

export default checkPremium;
