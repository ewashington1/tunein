"use client";

import React from "react";
import { SongRating } from "@prisma/client";
import { Track } from "@spotify/web-api-ts-sdk";
import { useState, useEffect } from "react";
import { FeedItem } from "../../home/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";
import axios, { AxiosResponse } from "axios";
import Marquee from "react-fast-marquee";
import MyStarRatingAlbum from "../MyStarRatingAlbum";
import Image from "next/image";
import { Album } from "@prisma/client";
import { Rating } from "react-simple-star-rating";

type FeedSongRatingProps = {
  album: FeedItem;
};

const FeedSongRating = ({ album }: FeedSongRatingProps) => {
  // could make feedSongRating and feedAlbum rating into one
  const [playMarquee, setPlayMarquee] = useState(false);

  return (
    <div
      className="bg-boxLightGrey p-3 rounded drop-shadow my-4 h-auto max-h-full "
      style={{ boxShadow: "-3px 5px 5px rgba(0, 0, 0.0, 0.08)" }}
    >
      {/* top section */}
      {/* scrolling text */}
      <div
        className="h-auto w-auto"
        onMouseEnter={() => setPlayMarquee(true)}
        onMouseLeave={() => setPlayMarquee(false)}
      >
        <Marquee play={playMarquee} speed={150}>
          {album.albumRatings.map((albumRating) => (
            <div className="flex items-center mr-5" key={albumRating.id}>
              <h1 className="text-2xl mr-3 font-light">
                {albumRating.user.username} rated {album.name}
              </h1>
              <div className="pointer-events-none">
                <Rating
                  allowHover={false}
                  disableFillHover={true}
                  fillColor="#a220c9"
                  initialValue={albumRating.stars}
                  size={25}
                  allowFraction
                />
              </div>
            </div>
          ))}
        </Marquee>
      </div>

      <hr className="my-2" />
      {/* middle section */}
      <div className="flex">
        <Image
          className="mr-5 h-28 w-28"
          src={album.image_url}
          alt="cover"
          height={112}
          width={112}
          loading="lazy"
        />
        {/* description */}
        <div className="self-center align-middle max-w-[22rem] overflow-x-hidden">
          {/* name, dot, song */}
          <div className="flex items-center mb-3">
            <p className="font-bold text-4xl mr-3 whitespace-nowrap textSlide">
              {album.name}
            </p>
            <div className="bg-white w-1 h-1 rounded-full" />
            <p className="ml-3 font-light text-textLightGrey">Album</p>
          </div>
          {/* artists */}
          <p className="text-2xl font-extralight text-textLightGrey whitespace-nowrap textSlide">
            {album.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        {/* song Rating */}
        <div className="self-center ml-auto text-center">
          <div className="text-xl font-extralight">My Rating:</div>
          <div>
            <MyStarRatingAlbum album={album} />
          </div>
        </div>
      </div>
      <hr className="my-3" />
      {/* bottom section */}
      <p>Add comment...</p>
    </div>
  );
};

export default FeedSongRating;
