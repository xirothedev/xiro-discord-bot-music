import config from "@/config";
import commands from "@/handlers/commands";
import events from "@/handlers/events";
import Logger from "@/helpers/logger";
import antiCrash from "@/plugins/antiCrash";
import { PrismaClient } from "@prisma/client";
import { ActivityType, Client, Collection, Partials, PresenceUpdateStatus } from "discord.js";
import type { Command } from "typings/command";
import LavalinkClient from "./LavalinkClient";
import { Utils } from "./Utils";

export const logger = new Logger();
export const prisma = new PrismaClient();

if (config.preconnect) {
    (async () =>
        await prisma.$connect().then(() => {
            logger.info("Connected to database");
        }))();
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

    public utils = new Utils();

    public emoji = config.emoji;

    public icons = config.icons;

    public color = config.color;

    public start = async (token: string, prefix: string) => {
        commands(this);
        events(this);
        antiCrash(this);
        // components(this);

        await this.login(token);
        await this.application?.fetch();
        this.prefix = prefix;
        this.user?.setActivity(`Sử dụng ${prefix}help để biết thêm chi tiết`, {
            type: ActivityType.Streaming,
            url: "https://github.com/sunaookamishiroko",
        });
        this.user?.setStatus(PresenceUpdateStatus.Online);
    };
}

type CustomClient = ExtendedClient;
declare global {
    interface ExtendedClient extends CustomClient {}
}
