import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SongRating as PrismaSongRating } from "@prisma/client";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";
import MyStarRatingSongSpotify from "@/app/components/myRatings/MyStarRatingSongSpotify";
import { Track } from "@spotify/web-api-ts-sdk";

//friend ratings section
const friendRatingsSectionStyle = {
  background: "rgba(0, 0, 0, 0.35)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

type SongRating = PrismaSongRating & {
  user: {
    username: string;
    id: string;
    pfp: string | null;
  };
};

export const FriendRatingsSection = ({
  songId,
  song,
}: {
  songId: string;
  song: Track | undefined;
}) => {
  const [friendRatings, setFriendRatings] = useState<SongRating[] | undefined>(
    undefined
  );
  const fetchFriendRatings = () => {
    axios
      .get(`/api/prisma/ratings/friendsSongRatings/${songId}`)
      .then((res) => {
        setFriendRatings(res.data.ratings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchFriendRatings();
  }, []);

  return (
    <div
      className="flex flex-col max-h-[50vh] pl-5 pt-5 pr-5 pb-3 w-2/5"
      style={friendRatingsSectionStyle}
    >
      <h1 className="text-2xl font-semibold">Friend Ratings:</h1>

      {/* friend ratings */}
      <div className="overflow-y-scroll overflow-x-hidden commentSectionScrollbar h-full">
        {friendRatings ? (
          friendRatings.map((songRating, idx) => {
            return (
              <div key={idx} className=" py-2 flex gap-2">
                <Link
                  href={`/users/${songRating.userId}`}
                  className="flex gap-2"
                >
                  <Image
                    src={
                      songRating.user.pfp
                        ? songRating.user.pfp
                        : "/photos/defaultPfp.png"
                    }
                    alt="pfp"
                    width={28}
                    height={28}
                    className="inline-block rounded-full"
                  />
                  <div className="inline-block m">
                    {songRating.user.username.length < 12
                      ? songRating.user.username
                      : songRating.user.username.substring(0, 11).concat("...")}
                  </div>
                </Link>
                <div className="pointer-events-none inline-block">
                  <Rating
                    disableFillHover={true}
                    fillColor="#a220c9"
                    initialValue={songRating.stars}
                    size={25}
                    allowFraction
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
      <hr className="my-2" />
      <div className="self-center flex flex-col items-center gap-1">
        <div className=" font-extralight">My rating:</div>
        {song ? (
          <MyStarRatingSongSpotify song={song} />
        ) : (
          <div className="font-semibold text-xl">Loading...</div>
        )}
      </div>
      {/* intentionally casting as Track */}
    </div>
  );
};
