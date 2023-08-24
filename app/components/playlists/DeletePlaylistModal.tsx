import axios from "axios";
import React, { Dispatch, SetStateAction, useContext } from "react";
import { useRouter } from "next/navigation";
import PlaylistsContext from "@/app/PlaylistContext";

const DeletePlaylistModal = ({
  playlistId,
  setDeletePlaylistModalOpen,
  redirectHome,
}: {
  playlistId: string;
  setDeletePlaylistModalOpen: Dispatch<SetStateAction<boolean>>;
  redirectHome?: boolean;
}) => {
  const router = useRouter();

  const { updatePlaylists } = useContext(PlaylistsContext);

  const deletePlaylist = () => {
    axios
      .delete("/api/prisma/deletePlaylist/" + playlistId)
      .then((res) => {
        setDeletePlaylistModalOpen(false);
        updatePlaylists();
        if (redirectHome) {
          router.push("/home");
        }
      })
      .catch((err) => console.log(err));
  };
  const close = (e: any) => {
    if (e.target.id == "outside" || e.target.id == "cancel")
      setDeletePlaylistModalOpen(false);
  };

  return (
    <div
      className="inset-0 fixed flex justify-center z-50 items-center bg-white bg-opacity-25 backdrop-blur-sm"
      id="outside"
      onClick={close}
    >
      {/* modal */}
      <div className="w-auto bg-boxLightGrey h-auto flex flex-col m-auto rounded-lg overflow-hidden">
        {/* header container */}
        <div className="w-full h-1/5 p-5 bg-boxDarkGrey flex">
          {/* header text */}
          <div className=" text-center m-auto text-xl font-bold ">
            Are you sure you want to delete this playlist?
          </div>
        </div>
        <div className="flex flex-col justify-center items-center font-bold h-full gap-5 py-4">
          <button
            className="block px-5 py-1 bg-red-500 rounded-md"
            onClick={deletePlaylist}
          >
            Confirm Delete
          </button>
          <button
            id="cancel"
            className="block px-5 py-1 border-2 border-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlaylistModal;
