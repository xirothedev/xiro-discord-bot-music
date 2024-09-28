import config from "@/config";
import event from "@/layouts/event";
import type { Interaction } from "discord.js";
import ms from "ms";

export default event("interactionCreate", { once: false }, async (client, interaction: Interaction) => {
    if (interaction.isButton()) {
        const component = client.collection.components.buttons.get(interaction.customId);

        if (!component) return;

        if (
            (component.options?.everyone === false && interaction.user.id !== interaction.member?.user.id) ||
            (component.options?.permissions && !interaction.memberPermissions?.has(component.options?.permissions))
        ) {
            return await interaction
                .reply({
                    content: `❌ **|** Bạn không có quyền sử dụng nút bấm này!`,
                })
                .then((m) => setTimeout(() => m.delete(), ms(config.deleteErrorAfter)));
        }

        try {
            component.handler(client, interaction);
        } catch (error) {
            console.error(error);
        }

        return;
    }

    if (interaction.isAnySelectMenu()) {
        const component = client.collection.components.selects.get(interaction.customId);

        if (!component) return;

        if (
            component.options?.everyone &&
            component.options.everyone === false &&
            interaction.user.id !== interaction.member?.user.id
        ) {
            return await interaction
                .reply({
                    content: `❌ **|** Bạn không có quyền sử dụng lựa chọn này!`,
                })
                .then((m) => setTimeout(() => m.delete(), ms(config.deleteErrorAfter)));
        }

        try {
            component.handler(client, interaction);
        } catch (error) {
            console.error(error);
        }

        return;
    }

    if (interaction.isModalSubmit()) {
        const component = client.collection.components.modals.get(interaction.customId);

        if (!component) return;

        try {
            component.handler(client, interaction);
        } catch (error) {
            console.error(error);
        }

        return;
    }

    if (interaction.isAutocomplete()) {
        const component = client.collection.components.autocomplete.get(interaction.commandName);

        if (!component) return;

        try {
            component.handler(client, interaction);
        } catch (error) {
            console.error(error);
        }

        return;
    }
});
