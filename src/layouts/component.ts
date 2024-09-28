import type {
    AnySelectMenuInteraction,
    AutocompleteInteraction,
    ButtonInteraction,
    ModalSubmitInteraction,
    PermissionResolvable,
} from "discord.js";

interface ComponentOptions {
    ignore: boolean;
    permissions?: PermissionResolvable;
}

interface ButtonComponentOptions extends ComponentOptions {
    everyone?: boolean;
}

interface AnySelectMenuComponentOptions extends ComponentOptions {
    everyone?: boolean;
}

interface AutoCompleteComponentOptions extends ComponentOptions {}

interface ModalComponentOptions extends ComponentOptions {}

export const button = (
    customId: string,
    options: ButtonComponentOptions,
    handler: (client: ExtendedClient, interaction: ButtonInteraction<"cached">) => void
) => ({ customId, options, handler });

export const select = (
    customId: string,
    options: AnySelectMenuComponentOptions,
    handler: (client: ExtendedClient, interaction: AnySelectMenuInteraction<"cached">) => void
) => ({ customId, options, handler });

export const autocomplete = (
    commandName: string,
    options: AutoCompleteComponentOptions,
    handler: (client: ExtendedClient, interaction: AutocompleteInteraction<"cached">) => void
) => ({ commandName, options, handler });

export const modal = (
    customId: string,
    options: ModalComponentOptions,
    handler: (client: ExtendedClient, interaction: ModalSubmitInteraction<"cached">) => void
) => ({ customId, options, handler });
