"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarHalf, faStar } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "react-simple-star-rating";
import { prisma } from "../api/prisma";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Track } from "@spotify/web-api-ts-sdk";

type NewStarRatingSongProps = {
  track: Track;
};

const NewStarRatingSong = ({ track }: NewStarRatingSongProps) => {
  const { data: session } = useSession();

  //initialize this to your previous song rating instead
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    axios
      .get("/api/prisma/songRatings/" + track.id + "/" + session?.user!.id)
      .then((res) => {
        console.log(res);
        setRating(res.data.rating);
      })
      .catch((err) => console.log(err));
  }, []);

  const rate = async (stars: number) => {
    axios
      .post("/api/prisma/rateSong", {
        //how to fix this error below
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

export default NewStarRatingSong;
