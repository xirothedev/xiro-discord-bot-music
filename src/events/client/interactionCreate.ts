import { T } from "@/handlers/i18n";
import event from "@/layouts/event";
import { BaseInteraction, Collection, EmbedBuilder, type Interaction } from "discord.js";

const checkPermissions = (
    client: ExtendedClient,
    interaction: any,
    component: any,
    embed: EmbedBuilder,
) => {
    if (
        component?.options?.everyone === false &&
        interaction.user.id !== interaction.member?.user.id
    ) {
        return interaction.reply({
            embeds: [
                embed
                    .setColor(client.color.red)
                    .setDescription(
                        T(interaction.guild.language, "handler.no_permission"),
                    ),
            ],
        });
    }

    if (
        component?.options?.permissions &&
        !interaction.memberPermissions?.has(component.options.permissions)
    ) {
        return interaction.reply({
            embeds: [
                embed
                    .setColor(client.color.red)
                    .setDescription(
                        T(interaction.guild.language, "handler.no_permission"),
                    ),
            ],
        });
    }
    return null;
};

const handleInteraction = async (
    client: ExtendedClient,
    interaction: Interaction,
    componentCollection: Collection<string, any>,
    customId: string,
) => {
    const embed = new EmbedBuilder();
    const component = componentCollection.get(customId);

    if (!component) return;

    const permissionError = checkPermissions(client, interaction, component, embed);
    if (permissionError) return;

    try {
        component.handler(client, interaction);
    } catch (error) {
        console.error(error);
    }
};

export default event(
    "interactionCreate",
    { once: false },
    async (client, interaction: BaseInteraction) => {
        if (interaction.isButton()) {
            await handleInteraction(
                client,
                interaction,
                client.collection.components.buttons,
                interaction.customId,
            );
        } else if (interaction.isAnySelectMenu()) {
            await handleInteraction(
                client,
                interaction,
                client.collection.components.selects,
                interaction.customId,
            );
        } else if (interaction.isModalSubmit()) {
            await handleInteraction(
                client,
                interaction,
                client.collection.components.modals,
                interaction.customId,
            );
        } else if (interaction.isAutocomplete()) {
            await handleInteraction(
                client,
                interaction,
                client.collection.components.autocomplete,
                interaction.commandName,
            );
        }
    },
);
