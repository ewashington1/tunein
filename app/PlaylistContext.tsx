import { createContext } from "react";
import { PlaylistWithUsername } from "./types";

const PlaylistsContext = createContext<{
  playlists: PlaylistWithUsername[];
  updatePlaylists: () => Promise<void>;
}>({ playlists: [], updatePlaylists: async () => {} });

export default PlaylistsContext;
