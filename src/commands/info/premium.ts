import config from "@/config";
import prefix from "@/layouts/prefix";
import { EmbedBuilder, time } from "discord.js";
import { Category } from "@/typings/utils";

export default prefix(
    "premium",
    {
        description: {
            content: "Hiển thị tiến trình premium.",
            examples: ["premium"],
            usage: "premium",
        },
        cooldown: "5s",
        botPermissions: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
        ignore: false,
        category: Category.info,
    },
    async (client, guild, user, message, args) => {
        const isPremium =
            (user.premiumTo instanceof Date && user.premiumTo.getTime() > Date.now()) || !!user.premiumKey;

        const embed = new EmbedBuilder()
            .setAuthor({
                iconURL: client.user.displayAvatarURL(),
                name: "Trạng thái premium",
                url: `https://discord.com/users/${config.users.ownerId}`,
            })
            .setColor(client.color.main)
            .setDescription(
                `
        > - Tình trạng: ${isPremium ? "Hoạt động" : "Không hoạt động"}
        > - Đã đăng kí từ: ${user.premiumFrom ? time(user.premiumFrom, "R") : "Chưa có dữ liệu"}
        > - Ngày hết hạn: ${!isPremium ? "Không có dữ liệu" : user.premiumKey ? "Trọn đời" : time(user.premiumTo!, "R")}
        > - Các gói đã đăng kí: ${user.premiumPlan.length <= 0 ? "Không có dữ liệu" : user.premiumPlan.map((plan) => `\`${plan}\``).join(", ")}
        `,
            )
            .setTimestamp()
            .setFooter({ text: `@${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        return message.channel.send({ embeds: [embed] });
    },
);
