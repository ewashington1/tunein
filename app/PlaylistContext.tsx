import { Playlist } from "@prisma/client";
import { createContext } from "react";

const PlaylistsContext = createContext<Playlist[] | null>(null);

export default PlaylistsContext;
