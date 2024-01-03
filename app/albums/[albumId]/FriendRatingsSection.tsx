import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlbumRating as PrismaAlbumRating } from "@prisma/client";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";
import MyStarRatingAlbumSpotify from "@/app/components/myRatings/MyStarRatingAlbumSpotify";
import { Album } from "@spotify/web-api-ts-sdk";

//friend ratings section
const friendRatingsSectionStyle = {
  background: "rgba(0, 0, 0, 0.35)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

type AlbumRating = PrismaAlbumRating & {
  user: {
    username: string;
    id: string;
    pfp: string | null;
  };
};

export const FriendRatingsSection = ({ albumId }: { albumId: string }) => {
  const [friendRatings, setFriendRatings] = useState<AlbumRating[] | undefined>(
    undefined
  );
  const fetchFriendRatings = () => {
    axios
      .get(`/api/prisma/ratings/friendsAlbumRatings/${albumId}`)
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
      <div className="overflow-y-scroll commentSectionScrollbar h-full">
        {friendRatings ? (
          friendRatings.map((albumRating, idx) => {
            return (
              <div key={idx} className=" py-2 flex gap-2">
                <Link
                  href={`/users/${albumRating.userId}`}
                  className="flex gap-2"
                >
                  <Image
                    src={
                      albumRating.user.pfp
                        ? albumRating.user.pfp
                        : "/photos/defaultPfp.png"
                    }
                    alt="pfp"
                    width={28}
                    height={28}
                    className="inline-block rounded-full"
                  />
                  <div className="inline-block m">
                    {albumRating.user.username.length < 12
                      ? albumRating.user.username
                      : albumRating.user.username
                          .substring(0, 11)
                          .concat("...")}
                  </div>
                </Link>
                <div className="pointer-events-none inline-block">
                  <Rating
                    disableFillHover={true}
                    fillColor="#a220c9"
                    initialValue={albumRating.stars}
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
        <MyStarRatingAlbumSpotify
          album={{ album: { id: albumId } } as unknown as Album}
        />
      </div>
    </div>
  );
};
