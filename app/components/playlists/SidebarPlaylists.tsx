import { Playlist } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import SidebarPlaylistCard from "./SidebarPlaylistCard";
import PlaylistsContext from "@/app/PlaylistContext";

const SidebarPlaylists = () => {
  const playlists = useContext(PlaylistsContext);

  if (playlists === null)
    return (
      <div className=" overflow-y-scroll overflow-x-hidden lightGreyScrollbarForSidebar mx-1 max-h-[45%] min-h-[45vh]"></div>
    );

  return (
    <div className=" overflow-y-scroll overflow-x-hidden lightGreyScrollbarForSidebar mx-1 max-h-[55vh] min-h-[55vh]">
      {playlists!.map((playlist) => {
        return <SidebarPlaylistCard key={playlist.id} playlist={playlist} />;
      })}
    </div>
  );
};

export default SidebarPlaylists;
