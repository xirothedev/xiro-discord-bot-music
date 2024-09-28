import event from "@/layouts/event";

export default event("raw", { once: false }, async (client, d) => {
    client.manager.sendRawData(d);
});
