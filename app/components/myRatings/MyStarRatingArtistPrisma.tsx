"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarHalf, faStar } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "react-simple-star-rating";
import { prisma } from "@/app/api/prisma";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Artist } from "@prisma/client";

type MyStarRatingArtistProps = {
  artist: Artist;
};

const MyStarRatingArtistPrisma = ({ artist }: MyStarRatingArtistProps) => {
  //initialize this to your previous song rating instead
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("/api/prisma/ratings/artistRatings/" + artist.id)
      .then((res) => {
        setRating(res.data.rating);
      })
      .catch((err) => console.log(err));
  }, []);

  const rate = async (stars: number) => {
    axios
      .post("/api/prisma/ratings/rateArtistPrisma", {
        stars: stars,
        artist: artist,
      })
      .then((res) => {
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

export default MyStarRatingArtistPrisma;
