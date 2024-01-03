"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Artist, Track as Song } from "@spotify/web-api-ts-sdk";
import Link from "next/link";
import CommentPage from "@/app/components/CommentPage";
import { CommentsWithUsernames } from "@/app/types";
import { useSession } from "next-auth/react";
import { SongRating as PrismaSongRating } from "@prisma/client";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";
import { SongDetailsHeader } from "./SongDetailsHeader";
import { SongDetailsBody } from "./SongDetailsBody";
import { SongCommentsSection } from "./SongCommentsSection";
import { SongLyricsBody } from "./SongLyricsBody";
import { FriendRatingsSection } from "./FriendRatingsSection";

// entire page
const page = () => {
  const songId = useParams().songId as string;
  const [songDetails, setSongDetails] = useState<
    (Song & { lyrics: string | null }) | undefined
  >(undefined);
  const fetchSongDetails = async () => {
    axios
      .get(`/api/spotify_requests/getSong/${songId}`)
      .then((res) => {
        setSongDetails(res.data.songDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // empty dependency array only renders once
  useEffect(() => {
    fetchSongDetails();
  }, []);

  console.count("song page render");

  // if there arent any song details, lazy loads
  return (
    <div className="w-[55%] h-[100vh] flex flex-col gap-6">
      <SongDetailsHeader song={songDetails} />
      <SongDetailsBody song={songDetails} />
      <div className="flex flex-row gap-2">
        <SongCommentsSection songId={songId} />
        <FriendRatingsSection songId={songId} song={songDetails} />
      </div>
      <SongLyricsBody lyrics={songDetails ? songDetails.lyrics : undefined} />
    </div>
  );
};

export default page;
