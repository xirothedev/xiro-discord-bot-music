import ms from "ms";

type CooldownProps = { name: string; availableAt: string };
const cooldown = new Map<string, CooldownProps[]>();

export const setCooldown = (
    authorId: string,
    commandInput: string,
    cooldownTime: string,
) => {
    const availableAt = Date.now() + ms(cooldownTime);
    if (!cooldown.has(authorId)) {
        cooldown.set(authorId, []);
    }
    const userCooldowns = cooldown.get(authorId) || [];
    userCooldowns.push({ name: commandInput, availableAt: availableAt.toString() });
    cooldown.set(authorId, userCooldowns);
};

export const isCooldownActive = (authorId: string, commandInput: string) => {
    const userCooldowns = cooldown.get(authorId) || [];
    const commandCooldown = userCooldowns.find(
        (cooldown) => cooldown.name === commandInput,
    );
    return commandCooldown && parseInt(commandCooldown.availableAt) >= Date.now();
};
