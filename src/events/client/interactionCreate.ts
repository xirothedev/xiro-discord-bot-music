import config from "@/config";
import event from "@/layouts/event";
import { EmbedBuilder, type Interaction } from "discord.js";
import ms from "ms";

export default event("interactionCreate", { once: false }, async (client, interaction: Interaction) => {
    const embed = new EmbedBuilder();

    if (interaction.isButton()) {
        const component = client.collection.components.buttons.get(interaction.customId);

        if (!component) return;

        if (
            (component.options?.everyone === false && interaction.user.id !== interaction.member?.user.id) ||
            (component.options?.permissions && !interaction.memberPermissions?.has(component.options?.permissions))
        ) {
            return await interaction.reply({
                embeds: [
                    embed.setColor(client.color.red).setDescription(`❌ **|** Bạn không có quyền sử dụng nút bấm này!`),
                ],
            });
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
            return await interaction.reply({
                embeds: [
                    embed
                        .setColor(client.color.red)
                        .setDescription(`❌ **|** Bạn không có quyền sử dụng lựa chọn này!`),
                ],
            });
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
