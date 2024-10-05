import type { Player, Track } from "lavalink-client";
import type { Requester } from "typings/player";

export const requesterTransformer = (requester: any): Requester => {
    if (typeof requester === "object" && "avatar" in requester && Object.keys(requester).length === 3)
        return requester as Requester;
    if (typeof requester === "object" && "displayAvatarURL" in requester) {
        return {
            id: requester.id,
            username: requester.username,
            avatarURL: requester.displayAvatarURL({ extension: "png" }),
            discriminator: requester.discriminator,
        };
    }
    return { id: requester!.toString(), username: "unknown" };
};

export async function autoPlayFunction(player: Player, lastTrack?: Track): Promise<void> {
    if (!player.get("autoplay")) return;
    if (!lastTrack) return;

    if (lastTrack.info.sourceName === "spotify") {
        const filtered = player.queue.previous.filter((v) => v.info.sourceName === "spotify").slice(0, 5);
        const ids = filtered.map(
            (v) => v.info.identifier || v.info.uri.split("/")?.reverse()?.[0] || v.info.uri.split("/")?.reverse()?.[1]
        );
        if (ids.length >= 2) {
            const res = await player
                .search(
                    {
                        query: `seed_tracks=${ids.join(",")}`, //`seed_artists=${artistIds.join(",")}&seed_genres=${genre.join(",")}&seed_tracks=${trackIds.join(",")}`;
                        source: "sprec",
                    },
                    lastTrack.requester
                )
                .then((response: any) => {
                    response.tracks = response.tracks.filter(
                        (v: { info: { identifier: string } }) => v.info.identifier !== lastTrack.info.identifier
                    ); // remove the lastPlayed track if it's in there..
                    return response;
                })
                .catch(console.warn);
            if (res && res.tracks.length > 0)
                await player.queue.add(
                    res.tracks.slice(0, 5).map((track: { pluginInfo: { clientData: any } }) => {
                        // transform the track plugininfo so you can figure out if the track is from autoplay or not.
                        track.pluginInfo.clientData = { ...(track.pluginInfo.clientData || {}), fromAutoplay: true };
                        return track;
                    })
                );
        }
        return;
    }

    if (lastTrack.info.sourceName === "youtube" || lastTrack.info.sourceName === "youtubemusic") {
        const res = await player
            .search(
                {
                    query: `https://www.youtube.com/watch?v=${lastTrack.info.identifier}&list=RD${lastTrack.info.identifier}`,
                    source: "youtube",
                },
                lastTrack.requester
            )
            .then((response: any) => {
                response.tracks = response.tracks.filter(
                    (v: { info: { identifier: string } }) => v.info.identifier !== lastTrack.info.identifier
                ); // remove the lastPlayed track if it's in there..
                return response;
            })
            .catch(console.warn);
        if (res && res.tracks.length > 0)
            await player.queue.add(
                res.tracks.slice(0, 5).map((track: { pluginInfo: { clientData: any } }) => {
                    // transform the track plugininfo so you can figure out if the track is from autoplay or not.
                    track.pluginInfo.clientData = { ...(track.pluginInfo.clientData || {}), fromAutoplay: true };
                    return track;
                })
            );
        return;
    }
    return;
}
