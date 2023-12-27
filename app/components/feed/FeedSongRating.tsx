"use client";

import React from "react";
import { useState } from "react";
import { FeedItem } from "../../home/page";
import Marquee from "react-fast-marquee";
import MyStarRatingSongPrisma from "@/app/components/myRatings/MyStarRatingSongPrisma";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { Song } from "@prisma/client";
import CommentPage from "../CommentPage";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type FeedSongRatingProps = {
  song: FeedItem;
};

const FeedSongRating = ({ song }: FeedSongRatingProps) => {
  //CODE FOR WHEN SHALLOW ROUTING COMES OUT
  // const router = useRouter();
  // const openComments = () => {
  //   setCommentModalOpen(true);
  //   router.push(`/p/${song.id}`);
  // };

  // const closeComments = () => {
  //   setCommentModalOpen(false);
  //   router.push("/home");
  // };

  // could make feedSongRating and feedAlbum rating into one
  const [playMarquee, setPlayMarquee] = useState(false);

  const [commentModalOpen, setCommentModalOpen] = useState<boolean>(false);

  const simplifiedSong: Song = {
    id: song.id,
    name: song.name,
    image_url: song.image_url,
    preview_url: song.preview_url as string | null,
  };

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
          {song.songRatings!.map((songRating) => (
            <div className="flex items-center mr-5" key={songRating.userId}>
              <h1 className="text-2xl mr-3 font-light">
                {songRating.user.username} rated {song.name}
              </h1>
              <div className="pointer-events-none">
                <Rating
                  disableFillHover={true}
                  fillColor="#a220c9"
                  initialValue={songRating.stars}
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
          src={song.image_url}
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
              {song.name}
            </p>
            <div className="bg-white w-1 h-1 rounded-full" />
            <p className="ml-3 font-light text-textLightGrey">Song</p>
          </div>
          {/* artists */}
          <p className="text-2xl font-extralight text-textLightGrey whitespace-nowrap textSlide">
            {song.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        {/* song Rating */}
        <div className="self-center ml-auto text-center">
          <div className="text-xl font-extralight">My Rating:</div>
          <div>
            <MyStarRatingSongPrisma song={simplifiedSong} />
          </div>
        </div>
      </div>
      <hr className="my-3" />
      {/* bottom section */}
      <button onClick={() => setCommentModalOpen(true)}>Add comment...</button>
      {commentModalOpen &&
        createPortal(
          <CommentPage song={song} setCommentModalOpen={setCommentModalOpen} />,
          document.body
        )}
    </div>
  );
};

export default FeedSongRating;
