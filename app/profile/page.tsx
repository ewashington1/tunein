"use client";

import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import axios from "axios";
import ChangeImageModal from "./ChangeImageModal";
import Link from "next/link";

const page = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  //only for if we want to allow username changes
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [changeImageModalOpen, setChangeImageModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated") {
      const getUser = async () => {
        axios
          .get("/api/prisma/getUser")
          .then((res) => {
            setUser(res.data.user);
            setName(res.data.user.name);
            setBio(res.data.user.bio === null ? undefined : res.data.user.bio);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getUser();
    }
  }, [status]);

  const updateUser = async (e: any) => {
    e.preventDefault();
    axios
      .patch("/api/prisma/updateUser", {
        userId: session?.user.id,
        name: name,
        bio: bio,
      })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AuthenticatedLayout>
      <div>
        <div
          className="mt-12 flex p-3 items-center justify-center gap-x-2 bg-boxLightGrey"
          style={{ boxShadow: "-3px 5px 5px rgba(0, 0, 0.0, 0.5)" }}
        >
          <Link
            className="h-auto px-3 py-2 w-auto text-white bg-purple rounded-md"
            href={`/profile/myTopSongs`}
          >
            My Top Songs
          </Link>
          <Link
            className="h-auto px-3 py-2 w-auto text-white bg-purple rounded-md"
            href={`/profile/myTopAlbums`}
          >
            My Top Albums
          </Link>
          <Link
            className="h-auto px-3 py-2 w-auto text-white bg-purple rounded-md"
            href={`/profile/myTopArtists`}
          >
            My Top Artists
          </Link>
        </div>
        <form
          className="bg-boxLightGrey p-10 mt-4 w-[35rem] h-auto h-max-[45rem]"
          style={{ boxShadow: "-3px 5px 5px rgba(0, 0, 0.0, 0.5)" }}
        >
          {/* header portion */}
          <div className="flex">
            {/* image */}
            <div className="flex flex-col mr-2 overflow-clip">
              <img
                className="h-28 aspect-square object-cover rounded-full"
                src={user?.pfp != null ? user?.pfp : "/photos/defaultPfp.png"}
                alt="photo"
              />
              {/* add s3client stuff */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setChangeImageModalOpen(true);
                }}
                className="bg-boxLightGrey relative bottom-7 left-2 pb-1 w-24 opacity-[65%] hover:opacity-[85%] rounded-b-full"
              >
                Edit
              </button>
            </div>
            <div className="ml-7">
              {/* username */}
              <div className="text-3xl font-bold mb-5">@{user?.username}</div>
              {/* name */}
              <input
                className=" bg-[#303030] pl-5 py-1 text-lg rounded-full text-neutral-400"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name"
              />
            </div>
          </div>
          {/* rest of the form */}
          <textarea
            className="text-neutral-400 bg-[#303030] rounded-lg resize-none px-5 py-3 w-full h-72"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A brief description of yourself"
          />
          <button
            className="flex bg-purple rounded-md justify-center w-[5rem] font-bold text-lg ml-auto mt-7"
            style={{
              boxShadow: "-3px 5px 0px rgba(142, 12, 181, .5)",
            }}
            type="submit"
            onClick={updateUser}
          >
            Save
          </button>
        </form>
      </div>
      {/* main box */}

      {changeImageModalOpen && (
        <ChangeImageModal
          setChangeImageModalOpen={setChangeImageModalOpen}
          imagePath={user && user.pfp}
        />
      )}
    </AuthenticatedLayout>
  );
};

export default page;
