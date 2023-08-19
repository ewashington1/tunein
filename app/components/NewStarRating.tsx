"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarHalf, faStar } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "react-simple-star-rating";
import { prisma } from "../api/prisma";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Track } from "@spotify/web-api-ts-sdk";

type NewStarRatingProps = {
  track: Track;
};

const NewStarRating = ({ track }: NewStarRatingProps) => {
  const { data: session } = useSession();
  const rate = async (stars: number) => {
    axios
      .post("/api/prisma/rateSong", {
        userId: session?.user!.id,
        songId: track.id,
        stars: stars,
        name: track.name,
        artists: track.artists, //array
        preview_url: track.preview_url, //string url
        image_url: track.album.images[0].url, //sgtring url
      })
      .then((res) => {
        console.log(res);
        setRating(res.data.newRating);
      })
      .catch((err) => console.log(err));
  };
  //initialize this to your previous song rating instead
  const [rating, setRating] = useState<number>(0);
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

export default NewStarRating;
