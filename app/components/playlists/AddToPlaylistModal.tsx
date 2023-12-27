"use client";

//MAYBE JUST USE REACT MODAL LIBRARY and react
import React, { Dispatch, SetStateAction, useContext, useRef } from "react";
import PlaylistCard from "./PlaylistCard";
import { Track } from "@spotify/web-api-ts-sdk";
import axios, { AxiosResponse } from "axios";
import PlaylistsContext from "@/app/PlaylistContext";
import TopSongsCard from "./TopSongsCard";

interface AddToPlaylistModalProps {
  setAddToPlaylistModalOpen: Dispatch<SetStateAction<boolean>>;
  song: Track;
}

const AddToPlaylistModal = ({
  setAddToPlaylistModalOpen,
  song,
}: AddToPlaylistModalProps) => {
  const { playlists } = useContext(PlaylistsContext);
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

  const topSongsSelected = useRef<boolean>(false);

  const confirm = () => {
    const promises: Promise<AxiosResponse>[] = [];

    if (addTo.size !== 0) {
      const playlists = Array.from(addTo);
      const addToPlaylistPromise = axios.post(
        "/api/prisma/playlists/addToPlaylists",
        {
          playlists: playlists,
          song: song,
        }
      );
      promises.push(addToPlaylistPromise);
    }

    if (topSongsSelected.current === true) {
      const addToTopSongsPromise = axios.post("/api/prisma/top/addToTopSongs", {
        song: song,
      });
      promises.push(addToTopSongsPromise);
    }

    Promise.all(promises)
      .then(() => {
        alert("Success");
        setAddToPlaylistModalOpen(false);
      })
      .catch((err) => {
        alert("Failure");
        setAddToPlaylistModalOpen(false);
      });
  };

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
          <TopSongsCard topSongsSelected={topSongsSelected} />
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
