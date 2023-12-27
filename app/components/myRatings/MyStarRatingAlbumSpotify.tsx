"use client";

import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Album } from "@spotify/web-api-ts-sdk";

type MyStarRatingAlbumPropsSpotify = {
  album: Album;
};

const MyStarRatingAlbumSpotify = ({ album }: MyStarRatingAlbumPropsSpotify) => {
  //initialize this to your previous song rating instead
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("/api/prisma/ratings/albumRatings/" + album.id)
      .then((res) => {
        setRating(res.data.rating);
      })
      .catch((err) => console.log(err));
  }, []);

  const rate = async (stars: number) => {
    axios
      .post("/api/prisma/ratings/rateAlbum", {
        stars: stars,
        album: album,
      })
      .then((res) => {
        // console.log(res);
        setRating(res.data.newRating);
      })
      .catch((err) => console.log(err));
  };

  if (rating === null) {
    return <div className="font-bold text-xl">Loading...</div>;
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

export default MyStarRatingAlbumSpotify;
