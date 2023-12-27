"use client";

import PlaylistsContext from "@/app/PlaylistContext";
import axios from "axios";
import { useSession } from "next-auth/react";
//MAYBE JUST USE REACT MODAL LIBRARY and react

import React, { useContext, useState } from "react";

const CreatePlaylistModal = ({ setPlaylistModalOpen }: any) => {
  const close = (e: any) => {
    if (e.target!.id == "outside" || e.target.id === "cancel")
      setPlaylistModalOpen(false);
  };

  const { data: session } = useSession();

  const { updatePlaylists } = useContext(PlaylistsContext);

  const [imagePreview, setImagePreview] = useState<any>(
    "/photos/defaultPlaylistImage.png"
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const submit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name!);
    formData.append("description", description!);
    formData.append("userId", session?.user!.id);
    formData.append("image", imageFile!);

    axios
      .post("/api/prisma/playlists/createPlaylist", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setPlaylistModalOpen(false);
        updatePlaylists();
      })
      .catch((err) => {
        console.log(err);
      });

    //do this on successful response
  };

  const changeImage = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImgPreview = URL.createObjectURL(file);
      setImagePreview(newImgPreview);
      setImageFile(file);
    }
  };

  return (
    // background
    <div
      className="inset-0 fixed flex justify-center items-center bg-white bg-opacity-25 backdrop-blur-sm"
      id="outside"
      onClick={close}
    >
      {/* modal */}
      <div className="w-1/2 bg-boxLightGrey h-1/2 flex flex-col m-auto rounded-lg overflow-hidden">
        {/* header container */}
        <div className="w-full h-1/5 bg-boxDarkGrey flex">
          {/* header text */}
          <div className=" text-center m-auto text-3xl font-bold ">
            Create Playlist
          </div>
        </div>
        {/* main part */}
        <div className="h-full flex my-3 mx-4">
          {/* left side with image and change image */}
          <div className=" flex justify-start flex-col h-auto">
            <img
              src={imagePreview}
              alt="image"
              className=" aspect-square w-auto max-w-[14rem]"
            />
            <input
              type="file"
              hidden
              accept="image/jpeg, image/png, image/jpg"
              id="playlistImage"
              onChange={changeImage}
            />
            <label
              htmlFor="playlistImage"
              className="cursor-pointer self-center font-extralight"
            >
              Change Image
            </label>
          </div>
          {/* right side with text inputs */}
          <form className="ml-3 w-full flex flex-col" onSubmit={submit}>
            <input
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist Name"
              className="w-full bg-[#4e4e4e] py-3 px-2 rounded-lg text-xl font-bold ring-transparent outline-none"
            />
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Playlist Description"
              className="resize-none w-full bg-[#4e4e4e] py-3 px-2 rounded-lg text-sm font-light my-1 h-full ring-transparent outline-none"
            />
            <div className="self-end my-2">
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
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
