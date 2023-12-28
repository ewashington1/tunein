"use client";

import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Artist } from "@spotify/web-api-ts-sdk";

type MyStarRatingArtistPropsSpotify = {
  artist: Artist;
};

const MyStarRatingArtistSpotify = ({
  artist,
}: MyStarRatingArtistPropsSpotify) => {
  //initialize this to your previous song rating instead
  const [rating, setRating] = useState<number | null>(null);

  // gets your previous artist rating on render
  useEffect(() => {
    axios
      .get("/api/prisma/ratings/artistRatings/" + artist.id)
      .then((res) => {
        setRating(res.data.rating);
      })
      .catch((err) => console.log(err));
  }, []);

  // rates the artist
  const rate = async (stars: number) => {
    axios
      .post("/api/prisma/ratings/rateArtist", {
        stars: stars,
        artist: artist,
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

export default MyStarRatingArtistSpotify;
