"use client";

import AuthenticatedLayout from "@/app/components/layout/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Playlist, PlaylistSong, Song, User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import TopSongsSongCard from "./TopSongsSongCard";

interface PlaylistSongWithSong extends PlaylistSong {
  song: Song;
}

interface PlaylistWithSongs extends Playlist {
  songs: [PlaylistSongWithSong];
  user: User;
}

const page = () => {
  const [playlist, setPlaylist] = useState<PlaylistWithSongs | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const { data: session, status } = useSession();

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const removeFromPlaylists = async (songId: string) => {
    axios
      .delete("/api/prisma/removeFromTopSongs/" + songId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setPlaylist((prevPlaylist: any) => {
      if (!prevPlaylist || !prevPlaylist.songs) return prevPlaylist; // Return previous state if null or songs undefined

      return {
        ...prevPlaylist,
        songs: prevPlaylist.songs.filter((song: any) => song.songId !== songId),
      };
    });
  };

  const getTopSongs = async () => {
    axios
      .get(`/api/prisma/getTopSongsWithSongs/${session!.user.id}`)
      .then((res) => {
        setPlaylist(res.data);
      })
      .then((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      getTopSongs();
    }
  }, [session]);

  if (playlist === null) return <AuthenticatedLayout></AuthenticatedLayout>;

  return (
    <AuthenticatedLayout>
      {/* full container */}
      <div className="w-1/2 h-[95vh] my-4 relative flex flex-col">
        {/* top - title, owner, description, edit option, save btn */}
        <div className="w-full min-h-[22.5vh] h-[22.5vh] bg-boxDarkGrey rounded-lg flex p-4 relative">
          <div className=" bg-bgGrey h-[9.5rem] w-[9.5rem] p-4 text-center">
            <FontAwesomeIcon
              className="text-white w-full h-full"
              icon={faStar}
            />
          </div>
          {/* name, owner name, description */}
          <div className="flex flex-col ml-4 justify-center">
            <div className="font-bold text-6xl">My Top Songs</div>
          </div>

          {/* edit button */}
          {status === "authenticated" &&
            session!.user!.id === playlist.userId && (
              <>
                {!editMode ? (
                  <button
                    onClick={toggleEditMode}
                    className="bg-lightGrey absolute top-2 right-2 rounded-full p-1 w-10 h-10"
                  >
                    <img
                      className="w-6 m-auto"
                      src="/purplePencil.svg"
                      alt="pencil"
                    />
                  </button>
                ) : (
                  <button
                    onClick={toggleEditMode}
                    className="bg-purple absolute top-2 right-2 rounded-full p-1 w-10 h-10 pencilEditAnimation"
                  >
                    <img
                      className="w-6 m-auto stroke-white"
                      src="/whitePencil.svg"
                      alt="pencil"
                    />
                  </button>
                )}
              </>
            )}
        </div>
        {/* actual song cards -- maps through pivot table objects (SongPlaylist)*/}

        <div className="h-auto overflow-y-scroll flex-grow darkGreyScrollbar">
          {playlist.songs &&
            playlist.songs.map((playlistSong: PlaylistSongWithSong) => {
              return (
                <TopSongsSongCard
                  key={playlistSong.songId}
                  playlistSong={playlistSong}
                  editMode={editMode}
                  removeFromPlaylists={removeFromPlaylists}
                />
              );
            })}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default page;
