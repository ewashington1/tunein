"use client";

import React, { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { Artist } from "@spotify/web-api-ts-sdk";

const AddToTopAlbumsModal = ({
  setAddToTopArtistsOpen,
  artist,
}: {
  setAddToTopArtistsOpen: Dispatch<SetStateAction<boolean>>;
  artist: Artist;
}) => {
  const close = (e: any) => {
    if (e.target!.id == "outside" || e.target.id === "cancel")
      setAddToTopArtistsOpen(false);
  };

  const submit = async () => {
    axios
      .post("/api/prisma/addToTopArtists", { artist: artist })
      .then((res) => {
        alert("Success");
        setAddToTopArtistsOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // background
    <div
      className="inset-0 fixed flex justify-center z-50 items-center bg-white bg-opacity-25 backdrop-blur-sm"
      id="outside"
      onClick={close}
    >
      {/* modal */}
      <div className="w-1/4 bg-boxLightGrey h-1/6 flex flex-col m-auto rounded-lg overflow-hidden">
        {/* header container */}
        <div className="w-full h-1/3 bg-boxDarkGrey flex">
          {/* header text */}
          <div className=" text-center m-auto text-2xl font-bold ">
            Add to Top Artists
          </div>
        </div>
        {/* main part */}
        <div className="self-center my-auto flex gap-2">
          <button
            onClick={close}
            className="mx-2 px-4 py-2 rounded-md bg-lightGrey text-purple font-bold"
            id="cancel"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-purple text-lightGrey font-bold"
            onClick={submit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToTopAlbumsModal;
