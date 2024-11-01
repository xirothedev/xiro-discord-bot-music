import type { Playlist, PremiumKey, Track, User } from "@prisma/client";

interface PlaylistWithTrack extends Playlist {
    tracks: TrackData[];
}

interface PlaylistWithFullTrack extends Playlist {
    tracks: Track[];
}

interface TrackData extends Omit<Track, "track_id" | "playlist_id"> {}

interface FullUser extends User {
    playlists: PlaylistWithFullTrack[];
}
