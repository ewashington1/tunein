"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { createContext, useState, useEffect } from "react";
import { Playlist } from "@prisma/client";
import axios from "axios";
import PlaylistsContext from "@/app/PlaylistContext";

import React from "react";

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  //renaming data to session
  const { data: session, status } = useSession();

  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

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

  if (status === "loading") {
    return (
      <div className="flex justify-center">
        <LeftSideBar />
        <div className="text-white self-center font-bold text-4xl">
          Loading...
        </div>
        <RightSideBar />
      </div>
    );
  } else if (!session) {
    //replaces current browser url in stack by default
    redirect("/login");
  }

  return (
    <div className="flex justify-center">
      <PlaylistsContext.Provider value={playlists !== null ? playlists : []}>
        <LeftSideBar />
        {children}
        <RightSideBar />
      </PlaylistsContext.Provider>
    </div>
  );
};

export default AuthenticatedLayout;
