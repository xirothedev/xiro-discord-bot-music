import event from "@/layouts/event";
import type { Channel } from "discord.js";

export default event("channelCreate", { once: false }, async (client, channel: Channel) => {
    if (!channel.isVoiceBased()) return;

    await client.prisma.room.create({ data: { roomId: channel.id } });
});
