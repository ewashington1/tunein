"use client";

import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import axios from "axios";

const page = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const getUser = async () => {
        axios
          .get("/api/prisma/getUser/" + session?.user.id)
          .then((res) => {
            setUser(res.data.user);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getUser();
    }
  }, [status, session]);

  const updateUser = async () => {
    axios
      .get("/api/prisma/updateUser/" + session?.user!.id + "/" + user.id)
      .then((res) => {
        setFollowing(!following);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AuthenticatedLayout>
      {/* main box */}
      <form
        className="bg-boxLightGrey p-10 mt-12 w-[35rem] h-[45rem]"
        style={{ boxShadow: "-3px 5px 5px rgba(0, 0, 0.0, 0.5)" }}
      >
        {/* header portion */}
        <div className="flex mb-10">
          {/* image */}
          <div className="flex flex-col mr-2 overflow-clip">
            <img
              className="h-28 aspect-square object-cover rounded-full"
              src={user?.pfp != null ? user?.pfp : "/photos/defaultPfp.png"}
              alt="photo"
            />
            {/* add s3client stuff */}
            <button className="bg-boxLightGrey relative bottom-7 left-2 pb-1 w-24 opacity-[65%] hover:opacity-[85%] rounded-b-full">
              edit
            </button>
          </div>
          <div className="ml-7">
            {/* username */}
            <div className="text-3xl font-bold mb-5">@{user?.username}</div>
            {/* name */}
            <input
              className="bg-neutral-700 pl-5 py-1 text-lg rounded-full text-neutral-300"
              type="text"
              value={user?.name}
            />
          </div>
        </div>
        {/* rest of the form */}
        <textArea
          className="bg-neutral-700 rounded-lg resize-none px-5 py-1 w-full h-72"
          value={user?.bio}
        />
        <button
          className="flex bg-purple rounded-md justify-center w-[5rem] font-bold text-lg ml-auto mt-7"
          style={{
            boxShadow: "-3px 5px 0px rgba(142, 12, 181, .5)",
          }}
          onClick={updateUser}
        >
          Save
        </button>
      </form>
    </AuthenticatedLayout>
  );
};

export default page;
