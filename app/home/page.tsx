"use client";

import axios from "axios";
import React from "react";
import AuthenticatedLayout from "../components/AuthenticatedLayout";

const page = () => {
  const getTestSong = () => {
    axios.post("/api/spotify_requests/getSongTest").then((res) => {
      console.log(res);
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="flex align-middle justify-center">
        <button
          className=" text-8xl h-96 w-96 bg-purple p-3"
          onClick={() => getTestSong()}
        >
          Console log test song
        </button>
      </div>
    </AuthenticatedLayout>
  );
};

export default page;
