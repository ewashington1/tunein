"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Album } from "@spotify/web-api-ts-sdk";
import { AlbumDetailsHeader } from "./AlbumDetailsHeader";
import { FriendRatingsSection } from "./FriendRatingsSection";
import { AlbumCommentsSection } from "./AlbumCommentsSection";
import { AlbumDetailsBody } from "./AlbumDetailsBody";

// entire page
const page = () => {
  const albumId = useParams().albumId as string;
  const [albumDetails, setAlbumDetails] = useState<Album | undefined>(
    undefined
  );
  const fetchAlbumDetails = async () => {
    axios
      .get(`/api/spotify_requests/getAlbum/${albumId}`)
      .then((res) => {
        setAlbumDetails(res.data.albumDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // empty dependency array only renders once
  useEffect(() => {
    fetchAlbumDetails();
  }, []);

  // if there arent any album details, lazy loading
  //   if (!albumDetails) {
  //     return <div>loading...</div>;
  //   }
  return (
    <div className="w-[55%] h-[100vh] flex flex-col gap-6">
      <AlbumDetailsHeader album={albumDetails} />
      <AlbumDetailsBody album={albumDetails} />
      <div className="flex flex-row gap-2">
        <AlbumCommentsSection albumId={albumId} />
        <FriendRatingsSection albumId={albumId} />
      </div>
    </div>
  );
};

export default page;
