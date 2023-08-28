import { Playlist, TopSongs } from "@prisma/client";

export type PlaylistWithUsername = Playlist & { user: { name: string } };

export type TopSongsWithUsername = TopSongs & { user: { name: string } };
