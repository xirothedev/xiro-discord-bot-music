import type { Playlist, Track } from "@prisma/client";

interface PlaylistWithTrack extends Playlist {
    tracks: TrackData[];
}

interface TrackData extends Omit<Track, "playlist_user_id" | "playlist_name_id" | "track_id"> {}
