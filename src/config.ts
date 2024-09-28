const config = {
    preconnect: true,
    users: {
        ownerId: "1216624112139632711",
        devIds: ["1216624112139632711"],
    },
    deleteErrorAfter: "5s",
    emoji: {
        done: "<a:pnv_legittick:881652775711289414>",
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
        red: 0xff0000,
        green: 0x00ff00,
        blue: 0x0000ff,
        yellow: 0xffff00,
        main: 0x2f3136,
    } as { [key: string]: number },
};

export default config;
