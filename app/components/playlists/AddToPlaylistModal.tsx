"use client";

//MAYBE JUST USE REACT MODAL LIBRARY and react
import { Playlist } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import PlaylistCard from "./PlaylistCard";
import getPlaylists from "../functions/getPlaylists";
import { Track } from "@spotify/web-api-ts-sdk";
import axios from "axios";

interface AddToPlaylistModalProps {
  setAddToPlaylistModalOpen: Dispatch<SetStateAction<boolean>>;
  song: Track;
}

const AddToPlaylistModal = ({
  setAddToPlaylistModalOpen,
  song,
}: AddToPlaylistModalProps) => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>();
  //all the playlists that you've decided to add the song to
  const addTo = new Set();

  const close = (e: any) => {
    if (e.target!.id == "outside" || e.target.id === "cancel")
      setAddToPlaylistModalOpen(false);
  };

  const togglePlaylistSelect = (playlistId: string) => {
    if (addTo.has(playlistId)) {
      addTo.delete(playlistId);
    } else {
      addTo.add(playlistId);
    }
  };

  const confirm = () => {
    const addToArray = Array.from(addTo);
    axios
      .post("/api/prisma/addToPlaylists", {
        playlists: addToArray,
        song: song,
      })
      .then((res) => {
        alert("Success!");
        setAddToPlaylistModalOpen(false);
      })
      .catch((err) => {
        alert("Failure!");
      });
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      getPlaylists(session.user!.id).then((res) => {
        console.log(res);
        setPlaylists(res);
      });
    }
  }, [session]);

  return (
    // background
    <div
      className="inset-0 fixed flex justify-center items-center bg-white bg-opacity-25 backdrop-blur-sm z-50"
      id="outside"
      onClick={close}
    >
      {/* modal */}
      <div className="w-1/2 bg-boxLightGrey h-4/5 flex flex-col m-auto rounded-lg overflow-hidden">
        {/* header container */}
        <div className="w-full h-1/5 bg-boxDarkGrey flex">
          {/* header text */}
          <div className=" text-center m-auto text-3xl font-bold ">
            Add to Playlist
          </div>
        </div>
        {/* main part */}
        <div className="h-full flex flex-col my-3 mx-4 overflow-y-scroll darkGreyScrollbar p-1">
          {/* playlist cards */}
          {playlists &&
            playlists.map((playlist) => {
              return (
                <PlaylistCard
                  togglePlaylistSelect={togglePlaylistSelect}
                  playlist={playlist}
                />
              );
            })}
        </div>
        {/* confirm and cancel buttons */}
        <div className="self-end my-2 mx-7">
          <button
            onClick={close}
            className="mx-2 px-4 py-[0.125rem] rounded-md bg-lightGrey text-purple font-bold"
            id="cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-[0.125rem] rounded-md bg-purple text-lightGrey font-bold"
            onClick={confirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
