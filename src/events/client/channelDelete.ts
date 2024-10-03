import event from "@/layouts/event";
import type { Channel } from "discord.js";

export default event("channelDelete", { once: false }, async (client, channel: Channel) => {
    if (!channel.isVoiceBased()) return;

    await client.prisma.room.delete({ where: { roomId: channel.id } });
});
