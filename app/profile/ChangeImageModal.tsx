"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import PlaylistsContext from "@/app/PlaylistContext";

const ChangeImageModal = ({ setChangeImageModalOpen, imagePath }: any) => {
  const close = (e: any) => {
    if (e.target!.id == "outside" || e.target.id === "cancel")
      setChangeImageModalOpen(false);
  };

  const [imagePreview, setImagePreview] = useState<any>(
    imagePath !== null ? imagePath : "/photos/defaultPfp.png"
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("pfp", imageFile!);

    console.log(imageFile);

    axios
      .patch("/api/prisma/profile/changePfp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setChangeImageModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeImage = (e: any) => {
    console.log("changing");
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
      className="inset-0 fixed flex justify-center z-50 items-center bg-white bg-opacity-25 backdrop-blur-sm"
      id="outside"
      onClick={close}
    >
      {/* modal */}
      <form
        onSubmit={submit}
        className="w-1/4 bg-boxLightGrey h-1/2 flex flex-col m-auto rounded-lg overflow-hidden"
      >
        {/* header container */}
        <div className="w-full h-1/5 bg-boxDarkGrey flex">
          {/* header text */}
          <div className=" text-center m-auto text-3xl font-bold ">
            Change Profile Photo
          </div>
        </div>
        {/* main part */}
        <div className="h-auto flex flex-col my-3 mx-4 items-center">
          <img
            src={imagePreview ? imagePreview : "/photos/defaultPfp.png"}
            alt="image"
            className=" aspect-square w-auto max-w-[14rem]"
          />
          <input
            type="file"
            hidden
            accept="image/jpeg, image/png, image/jpg"
            id="pfp"
            onChange={changeImage}
          />
          <label
            htmlFor="pfp"
            className="cursor-pointer self-center font-extralight"
          >
            Change Image
          </label>
        </div>
        <div className="self-center mb-auto">
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
            Confirm Edits
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeImageModal;
