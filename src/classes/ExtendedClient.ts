import config from "@/config";
import commands from "@/handlers/commands";
import events from "@/handlers/events";
import { initI18n } from "@/handlers/i18n";
import Logger from "@/helpers/logger";
import antiCrash from "@/plugins/antiCrash";
import type { Command } from "@/typings/command";
import { PrismaClient } from "prisma/generated";
import {
    ActivityType,
    Client,
    Collection,
    Partials,
    PresenceUpdateStatus,
} from "discord.js";
import LavalinkClient from "./LavalinkClient";
import { Utils } from "./Utils";

export const logger = new Logger();
export const prisma = new PrismaClient();

if (config.preconnect) {
    prisma
        .$connect()
        .then(() => {
            logger.info("Connected to database");
        })
        .catch((error) => {
            logger.error("Failed when connect to database", error);
        });
}

export default class ExtendedClient extends Client<true> {
    public collection = {
        prefixcommands: new Collection<string, Command>(),
        aliases: new Collection<string, string>(),
        components: {
            buttons: new Collection<string, any>(),
            selects: new Collection<string, any>(),
            modals: new Collection<string, any>(),
            autocomplete: new Collection<string, any>(),
        },
    };

    public prefix?: string;

    public manager = new LavalinkClient(this);

    constructor() {
        super({
            intents: 3276799,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User,
                Partials.ThreadMember,
            ],
            allowedMentions: { parse: ["roles", "users"], repliedUser: false },
        });
    }

    public prisma = prisma;

    public logger = logger;

    public utils = new Utils(this);

    public emoji = config.emoji;

    public icons = config.icons;

    public color = config.color;

    public start = async (token: string, prefix: string) => {
        commands(this);
        events(this);
        // shardStart(this, token);
        antiCrash(this);
        initI18n(this);

        await this.login(token);
        const bot = await this.prisma.bot.findUnique({ where: { botId: this.user.id } });
        if (!bot) await this.prisma.bot.create({ data: { botId: this.user.id } });
        await this.application?.fetch();
        this.prefix = prefix;
        this.user?.setActivity(`Use ${prefix} help to know more`, {
            type: ActivityType.Streaming,
            url: "https://github.com/sunaookamishirokodev",
        });
        this.user?.setStatus(PresenceUpdateStatus.Online);
    };
}

type CustomClient = ExtendedClient;
declare global {
    interface ExtendedClient extends CustomClient {}
}
