import { Playlist } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import SidebarPlaylistCard from "./SidebarPlaylistCard";

const SidebarPlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const { data: session } = useSession();
  useEffect(() => {
    if (session !== null && session !== undefined) {
      axios
        .get("/api/prisma/getPlaylists/" + session!.user!.id)
        .then((res) => {
          setPlaylists(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [session]);

  if (playlists === null)
    return (
      <div className=" overflow-y-scroll overflow-x-hidden lightGreyScrollbarForSidebar mx-1 max-h-[30%]"></div>
    );

  return (
    <div className=" overflow-y-scroll overflow-x-hidden lightGreyScrollbarForSidebar mx-1 max-h-[40%]">
      {playlists!.map((playlist) => {
        return <SidebarPlaylistCard key={playlist.id} playlist={playlist} />;
      })}
    </div>
  );
};

export default SidebarPlaylists;
