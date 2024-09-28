import { EmbedBuilder, type PermissionResolvable } from "discord.js";
import type { PrefixOptions } from "typings/command";

export default function createDescription(client: ExtendedClient, name: string, command: PrefixOptions) {
    return new EmbedBuilder()
        .setColor(client.color.main)
        .setTitle(`Menu trợ giúp - ${name}`)
        .setDescription(
            `**Mô tả:** ${command.description.content}\n**Cách sử dụng:** ${client.prefix}${
                command.description.usage
            }\n**Ví dụ:** ${command.description.examples
                .map((example: string) => `${client.prefix}${example}`)
                .join(", ")}\n**Biệt danh:** ${
                command.aliases?.map((alias: string) => `\`${alias}\``).join(", ") || "Không có"
            }\n**Danh mục:** ${command.category}\n**Thời gian chờ:** ${command.cooldown}\n**Quyền:** ${
                command.userPermissions?.map((perm: PermissionResolvable) => `\`${perm.toString()}\``).join(", ") ||
                "Không có"
            }\n**Quyền của bot:** ${
                command.botPermissions?.map((perm: PermissionResolvable) => `\`${perm.toString()}\``).join(", ") ||
                "Không có"
            }\n**Chỉ dành cho nhà phát triển:** ${command.developersOnly ? "Có" : "Không"}**Giọng nói:** ${
                command.voiceOnly ? "Có" : "Không"
            }`
        );
}
