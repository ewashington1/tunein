"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarHalf, faStar } from "@fortawesome/free-solid-svg-icons";
import { Rating } from "react-simple-star-rating";
import { prisma } from "../api/prisma";
import { useSession } from "next-auth/react";
import axios from "axios";

type NewStarRatingProps = {
  id: string;
};

const NewStarRating = ({ id }: NewStarRatingProps) => {
  const { data: session } = useSession();
  const rate = async (stars: number) => {
    console.log("rated " + id + " " + stars + " stars");
    const userId = session?.user!.id;
    const songId = id;
    axios
      .post("/api/prisma/rateSong", {
        userId: userId,
        songId: songId,
        stars: stars,
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
