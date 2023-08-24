import { Playlist } from "@prisma/client";

export type PlaylistWithUsername = Playlist & { user: { name: string } };
