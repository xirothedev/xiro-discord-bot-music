import event from "@/layouts/event";
import type { Client } from "discord.js";

export default event("ready", { once: true }, async (_, client: Client<true>) => {
    _.logger.success("Logged in as: " + client.user.tag);
    await _.manager.init({ id: client.user.id, username: client.user.username, shards: "auto" });
});
