"use client";

import React from "react";
import { AlbumRating } from "@prisma/client";
import { Album } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import { FeedItem } from "../home/page";

type FeedAlbumRatingProps = {
  albumRating: FeedItem;
};

const FeedAlbumRating = ({ albumRating }: FeedAlbumRatingProps) => {
  let album = useState<Album | null>(null);

  //you'd make a fetch request using the songRating or albumRating id to set the associatedItems value
  //and once the associatedItem values aren't null, you'd put whatever info you need to in the return value.

  return (
    <div className="bg-boxLightGrey p-10 rounded w-2/5 h-2/5 pt-5 ">
      <div className="flex">
        <h1 className="text-l font-semibold mb-4 pr-3">Andre rated Utopia</h1>
        <p className="text-purple">******</p>
      </div>
      <hr className="w-9/10 pb-3" />
      <div className="flex pb-3">
        <img
          className="w-1/4 pr-5"
          src="https://media.pitchfork.com/photos/64c3bee4a7c2659c4cdcf382/1:1/w_320,c_limit/Travis%20Scott%20-%20Utopia.jpeg"
          alt="picture"
        />
        <div>
          <div className="flex pb-3 pt-3 align-items">
            <p className="font-bold text-2xl pr-3">Utopia</p>
            <div className="bg-white w-1 h-1 rounded-full" />
            <p className="font-thin pl-3 font-thin text-textLightGrey">Album</p>
            <div className="flex-end pl-20">
              <p>My Rating:</p>
              <p className="text-purple pl-3">* * * * *</p>
            </div>
          </div>
          <p className="text-2xl font-thin text-textLightGrey">Travis Scott</p>
        </div>
      </div>
      <hr className="w-9/10" />
      <p className="pt-3">Add comment...</p>
    </div>
  );
};

export default FeedAlbumRating;
