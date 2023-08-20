"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarHalf, faStar } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "react-simple-star-rating";
import { prisma } from "../api/prisma";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Album } from "@spotify/web-api-ts-sdk";

type NewStarRatingAlbumProps = {
  album: Album;
};

const NewStarRatingAlbum = ({ album }: NewStarRatingAlbumProps) => {
  const { data: session } = useSession();
  //initialize this to your previous song rating instead
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("/api/prisma/albumRatings/" + album.id + "/" + session?.user!.id)
      .then((res) => {
        console.log(res);
        setRating(res.data.rating);
      })
      .catch((err) => console.log(err));
  }, []);

  const rate = async (stars: number) => {
    axios
      .post("/api/prisma/rateAlbum", {
        //how to fix this error below
        userId: session?.user!.id,
        albumId: album.id,
        stars: stars,
        name: album.name,
        artists: album.artists, //array
        image_url: album.images[0].url, //sgtring url
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

export default NewStarRatingAlbum;
