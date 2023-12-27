"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { createContext, useState, useEffect } from "react";
import { Playlist } from "@prisma/client";
import axios from "axios";
import PlaylistsContext from "@/app/PlaylistContext";
import { useRouter } from "next/navigation";
import React from "react";
import { PlaylistWithUsername } from "@/app/types";
import { usePathname } from "next/navigation";

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  //renaming data to session
  const { data: session, status } = useSession();

  const pathname = usePathname();

  const [playlists, setPlaylists] = useState<PlaylistWithUsername[]>([]);

  const updatePlaylists = async () => {
    if (status === "authenticated") {
      axios
        .get("/api/prisma/playlists/getPlaylists")
        .then((res) => {
          setPlaylists(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login") {
      redirect("/login");
    } else if (status !== "loading") {
      updatePlaylists();
    }
  }, [status]);

  // if unauth and already at login screen, do nothing
  if (status === "unauthenticated" && pathname === "/login") {
    return <div className="flex justify-center">{children}</div>;
  }
  // if status loading and on login page, show nothing
  else if (status === "loading" && pathname === "/login") {
    console.log("gin");
    return <div className="flex justify-center">{children}</div>;
  }
  //if auth status loading and not on login page, show auth layout w loading
  else if (status === "loading" && pathname !== "/login") {
    return (
      <div className="flex justify-center">
        <LeftSideBar />
        <div className="text-white self-center font-bold text-4xl mt-4">
          Loading...
        </div>
        <RightSideBar />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <PlaylistsContext.Provider
        value={{ playlists: playlists, updatePlaylists: updatePlaylists }}
      >
        <LeftSideBar />
        {children}
        <RightSideBar />
      </PlaylistsContext.Provider>
    </div>
  );
};

export default AuthenticatedLayout;
