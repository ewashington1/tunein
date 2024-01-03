"use client";

import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Track } from "@spotify/web-api-ts-sdk";
import { FeedItem } from "@/app/home/page";

type MyStarRatingSongSpotifyProps = {
  song: Track;
};

const MyStarRatingSongSpotify = ({ song }: MyStarRatingSongSpotifyProps) => {
  const { data: session } = useSession();

  //initialize this to your previous song rating instead
  const [rating, setRating] = useState<number | undefined>(undefined);

  useEffect(() => {
    axios
      .get("/api/prisma/ratings/songRatings/" + song.id)
      .then((res) => {
        setRating(res.data.rating);
      })
      .catch((err) => console.log(err));
  }, []);

  const rate = async (stars: number) => {
    axios
      .post("/api/prisma/ratings/rateSong", {
        userId: session!.user.id,
        stars: stars,
        song: song,
      })
      .then((res) => {
        setRating(res.data.newRating);
      })
      .catch((err) => console.log(err));
  };

  if (rating === undefined) {
    return (
      <div className="flex pointer-events-none opacity-25">
        <Rating
          initialValue={rating}
          size={25}
          allowFraction
          disableFillHover
        />
      </div>
    );
  }

  return (
    <div className="flex">
      <Rating
        onClick={rate}
        fillColor="#a220c9"
        initialValue={rating}
        size={25}
        allowFraction
      />
    </div>
  );
};

export default MyStarRatingSongSpotify;
