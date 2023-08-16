"use client";

import React from "react";
import { SongRating } from "@prisma/client";
import { Track } from "@spotify/web-api-ts-sdk";
import { useState, useEffect } from "react";
import { FeedItem } from "../home/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";
import axios, { AxiosResponse } from "axios";
import Marquee from "react-marquee-slider";

type FeedSongRatingProps = {
  songRating: FeedItem;
};

const FeedSongRating = ({ songRating }: FeedSongRatingProps) => {
  const [track, setTrack] = useState<Track | null>(null);
  //const [song, setSong] = useState();

  useEffect(() => {
    const getSong = async () => {
      try {
        const response = await axios.post("/api/spotify_requests/getSong", {
          id: songRating.songId,
        });
        const body = response.data.body;
        setTrack(body);
      } catch (err) {
        console.log(err);
      }
    };
    getSong();
  }, []);

  //getSong();

  // track = axios()
  //you'd make a fetch request using the songRating or albumRating id to set the associatedItems value
  //and once the associatedItem values aren't null, you'd put whatever info you need to in the return value.

  return (
    <div
      className="bg-boxLightGrey p-4 rounded drop-shadow my-4 h-[28vh] "
      style={{ boxShadow: "-3px 5px 5px rgba(0, 0, 0.0, 0.08)" }}
    >
      {/* top section */}
      {/* scrolling text */}
      <div>
        <Marquee
          velocity={10}
          direction={"rtl"}
          scatterRandomly={false}
          resetAfterTries={200}
          onInit={() => {}}
          onFinish={() => {}}
        >
          {Array.from({ length: 5 }, (_, id) => (
            <div className="flex items-center mr-5" key={id}>
              <h1 className="text-2xl mr-3 font-light">
                Andre rated {track?.name}
              </h1>

              {Array.from({ length: 5 }, (_, index) => {
                return <FontAwesomeIcon icon={filledStar} key={index} />;
              })}
            </div>
          ))}
        </Marquee>
      </div>

      <hr className="my-2" />
      {/* middle section */}
      <div className="flex">
        <img
          className="h-28 w-28 mr-5"
          src={track?.album.images[0].url}
          alt="picture"
        />
        {/* description */}
        <div className="self-center align-middle max-w-[22rem] overflow-x-hidden">
          <div className="flex items-center mb-3">
            <p className="font-bold text-4xl mr-3 whitespace-nowrap">
              {track?.name}
              daksfjksdffsafdsjfldkmfldkmfdnadfdsfassalffsafdsjfldkmfldkmfdnadfdsfassalffsafdsjfldkmfldkmfdnadfdsfassalffsafdsjfldkmfldkmfdnadfdsfassal
            </p>
            <div className="bg-white w-1 h-1 rounded-full" />
            <p className="ml-3 font-light text-textLightGrey">Song</p>
          </div>
          <p className="text-2xl font-extralight text-textLightGrey whitespace-nowrap">
            {track?.artists.map((artist) => artist.name).join(", ")}
            ffsafdsjfldkmfldkmfdnadfdsfassalffsafdsjfldkmfldkmfdnadfdsfassalffsafdsjfldkmfldkmfdnadfdsfassalffsafdsjfldkmfldkmfdnadfdsfassal
          </p>
        </div>
        <div className="self-center ml-auto">
          <p className="text-xl font-extralight">My Rating:</p>
          <div>
            {Array.from({ length: 5 }, (_, index) => {
              return <FontAwesomeIcon icon={filledStar} key={index} />;
            })}
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
