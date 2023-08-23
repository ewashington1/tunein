"use client";

import AuthenticatedLayout from "@/app/components/layout/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Playlist, PlaylistSong, Song, User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import PlaylistSongCard from "@/app/components/playlists/PlaylistSongCard";

interface PlaylistSongWithSong extends PlaylistSong {
  song: Song;
}

interface PlaylistWithSongs extends Playlist {
  songs: [PlaylistSongWithSong];
  user: User;
}

const page = ({ params }: { params: { playlistId: string } }) => {
  const [playlist, setPlaylist] = useState<PlaylistWithSongs | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const { data: session, status } = useSession();

  const removeFromPlaylists = async (songId: string, playlistId: string) => {
    axios
      .post("/api/prisma/removeFromPlaylists", {
        playlistIds: [playlistId],
        songId: songId,
      })
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

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const getPlaylist = async () => {
    axios
      .get(`/api/prisma/getPlaylistWithSongs/${params.playlistId}`)
      .then((res) => {
        setPlaylist(res.data);
      })
      .then((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPlaylist();
  }, []);

  if (playlist === null) return <AuthenticatedLayout></AuthenticatedLayout>;

  return (
    <AuthenticatedLayout>
      {/* full container */}
      <div className="w-1/2 h-[95vh] my-4 relative flex flex-col">
        {/* top - title, owner, description, edit option, save btn */}
        <div className="w-full min-h-[22.5vh] h-[22.5vh] bg-boxDarkGrey rounded-lg flex p-4 relative">
          <Image
            loading="lazy"
            src={
              playlist.image !== null
                ? playlist.image
                : "/photos/defaultPlaylistImage.png"
            }
            alt="img"
            width={152}
            height={152}
            className="self-center"
          />
          {/* name, owner name, description */}
          <div className="flex flex-col ml-4">
            <div className="font-bold text-3xl">{playlist.name}</div>
            <div className="font-extralight text-textLightGrey text-lg">
              {playlist.user.name}
            </div>
            <div className="font-extralight text-textLightGrey text-sm">
              {playlist.description !== "null" &&
                playlist.description !== undefined &&
                (playlist.description!.length > 150
                  ? playlist.description?.slice(0, 150).concat("...")
                  : playlist.description)}
            </div>
          </div>
          {/* save button */}
          {!isSaved ? (
            <button
              onClick={() => setIsSaved(true)}
              className="absolute w-min h-min bg-purple text-center px-5 py-[1px] text-xl font-bold rounded-md bottom-3 right-3"
            >
              Save
            </button>
          ) : (
            <button
              onClick={toggleSave}
              className="absolute w-min h-min bg-lightGrey text-purple text-center px-5 py-[1px] text-xl font-bold rounded-md bottom-3 right-3"
            >
              Saved
            </button>
          )}
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
                <PlaylistSongCard
                  key={playlistSong.songId}
                  playlistSong={playlistSong}
                  editMode={editMode}
                  removeFromPlaylists={removeFromPlaylists}
                />
              );
            })}
        </div>
        {/* save button */}
      </div>
    </AuthenticatedLayout>
  );
};

export default page;
