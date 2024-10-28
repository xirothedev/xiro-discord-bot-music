import { type ColorResolvable } from "discord.js";

const config = {
    preconnect: true,
    users: {
        ownerId: "1291013382849167542",
        devIds: ["1291013382849167542"],
    },
    deleteErrorAfter: "5s",
    emoji: {
        done: "✅",
        pause: "⏸️",
        resume: "▶️",
        stop: "⏹️",
        skip: "⏭️",
        previous: "⏮️",
        forward: "⏩",
        rewind: "⏪",
        voldown: "🔉",
        volup: "🔊",
        shuffle: "🔀",
        loop: {
            none: "🔁",
            track: "🔂",
        },
        page: {
            last: "⏩",
            first: "⏪",
            back: "⬅️",
            next: "➡️",
            cancel: "⏹️",
            shuffle: "🔀",
        },
    },
    icons: {
        youtube: "https://i.imgur.com/xzVHhFY.png",
        spotify: "https://i.imgur.com/qvdqtsc.png",
        soundcloud: "https://i.imgur.com/MVnJ7mj.png",
        applemusic: "https://i.imgur.com/Wi0oyYm.png",
        deezer: "https://i.imgur.com/xyZ43FG.png",
        jiosaavn: "https://i.imgur.com/N9Nt80h.png",
    } as { [key: string]: string },
    color: {
        red: "Red",
        green: "Green",
        blue: "Blue",
        yellow: "Yellow",
        main: "#9BECFA",
    } as { [key: string]: ColorResolvable },
};

export default config;
