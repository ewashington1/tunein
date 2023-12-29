"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Artist, Track as Song } from "@spotify/web-api-ts-sdk";
import Link from "next/link";
import CommentPage from "@/app/components/CommentPage";
import { CommentsWithUsernames } from "@/app/types";
import { useSession } from "next-auth/react";
import { SongRating as PrismaSongRating } from "@prisma/client";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";

// entire page
const page = () => {
  const songId = useParams().songId;
  const [songDetails, setSongDetails] = useState<Song | undefined | null>(
    undefined
  );
  const fetchSongDetails = async () => {
    axios
      .get(`/api/spotify_requests/getSong/${songId}`)
      .then((res) => {
        setSongDetails(res.data.songDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [commentModalOpenDummy, setCommentModalOpenDummy] = useState(false);

  // empty dependency array only renders once
  useEffect(() => {
    fetchSongDetails();
  }, []);

  // if there arent any song details, lazy loading
  if (!songDetails) {
    return <div>loading...</div>;
  }
  return (
    <div className="w-[55%] h-[100vh] flex flex-col gap-6">
      <SongDetailsHeader song={songDetails} />
      <SongDetailsBody song={songDetails} />
      <div className="flex flex-row gap-2">
        <SongCommentsSection songId={songDetails.id} />
        <FriendRatingsSection songId={songDetails.id} />
      </div>
    </div>
  );
};

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

const FriendRatingsSection = ({ songId }: { songId: string }) => {
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
      className="flex flex-col max-h-[50vh] pl-5 pt-5 pr-5 pb-5 w-2/5"
      style={friendRatingsSectionStyle}
    >
      <h1 className="text-2xl font-semibold">Friend Ratings:</h1>

      {/* friend ratings */}
      <div className="overflow-y-scroll commentSectionScrollbar h-full">
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
    </div>
  );
};

// comments section
const commentSectionStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const SongCommentsSection = ({ songId }: { songId: string }) => {
  const { data: session } = useSession();

  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<
    CommentsWithUsernames[] | undefined | null
  >(undefined);
  const fetchComments = async () => {
    axios
      .get(`/api/prisma/comments/getComments/${songId}`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const submit = () => {
    axios
      .post("/api/prisma/comments/addComment", {
        comment: comment,
        songId: songId,
      })
      .then((res) => {
        setComments((prevComments) => {
          if (prevComments) {
            return [...prevComments, res.data];
          } else {
            return res.data;
          }
        });
        setComment("");
      })
      .catch((err) => {
        // add explanation for why there is a failure
        alert("Failure");
      });
  };
  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div
      className="flex flex-col max-h-[50vh] pl-5 pt-5 pr-1 pb-5 w-3/5"
      style={commentSectionStyle}
    >
      <div className="text-4xl font-semibold">Comments</div>
      {/* <hr /> */}
      <div className="pr-4 overflow-y-scroll commentSectionScrollbar">
        <div className="flex flex-col items-start">
          {comments && comments.length !== 0 ? (
            comments.map((existingComment) => (
              <div
                className="pl-2 py-1 border-b-[1px] border-white w-full"
                key={existingComment.userId}
              >
                <p
                  className={`font-bold text-lg inline ${
                    session?.user.id === existingComment.userId && "text-purple"
                  }`}
                >{`@${existingComment.user.username}: `}</p>
                <div className="text-textLightGrey inline text-lg">
                  {existingComment.comment}
                </div>
              </div>
            ))
          ) : comments ? (
            <div>No comments</div>
          ) : (
            <div>Loading comments...</div>
          )}
        </div>
      </div>

      <span className="w-full flex justify-center">
        <input
          className="text-white font-extralight w-f font-xl flex-grow mt-2 bg-transparent mx-2 focus:outline-none"
          placeholder="What are your thoughts?"
          value={comment}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setComment(e.target.value)
          }
          onKeyDownCapture={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
              submit();
            }
          }}
        />
        <button
          className=" self-end"
          onClick={submit}
          disabled={comment ? false : true}
        >
          <img
            src="/send_icon.svg"
            alt="Send"
            className={comment ? " h-6 w-6 opacity-75" : " h-6 w-6 opacity-25"}
          />
        </button>
      </span>
    </div>
  );
};

// song details body
const SongDetailsBody = ({ song }: { song: Song }): React.ReactNode => {
  return (
    <div className="flex flex-col text-xl">
      <div className="flex-row flex items-center">
        Popularity:
        <div className=" h-4 flex-grow bg-lightGrey mx-3" id="popularityBar">
          <div
            className={`h-full bg-purple`}
            style={{ width: `${song.popularity}%` }}
          />
        </div>
        {song.popularity}
      </div>
    </div>
  );
};

//song details header
const SongDetailsHeader = ({ song }: { song: Song }): React.ReactNode => {
  const artistLinks = song.artists.map((artist, idx) => {
    return (
      <React.Fragment key={artist.id}>
        <Link
          href={`/artists/${artist.id}`}
          className=" inline font-semibold hover:underline"
        >
          {artist.name}
        </Link>
        {idx < song.artists.length - 1 && <h3 className=" inline">,&nbsp; </h3>}
      </React.Fragment>
    );
  });

  function millisecondsToTime(milli: number) {
    var milliseconds = milli % 1000;
    var seconds = Math.floor((milli / 1000) % 60);
    var minutes = Math.floor((milli / (60 * 1000)) % 60);

    return minutes + " min " + seconds + " sec";
  }

  return (
    <div className="flex flex-row items-center bg-boxDarkGrey w-full h-[30%] rounded-2xl mt-6">
      <img
        src={song.album.images[0].url}
        alt="photo"
        className="h-[90%] mx-3"
      />
      <div className="flex flex-col text-white justify-end gap-3">
        <h3 className="text-lg">Song</h3>
        <h1 className="font-bold text-5xl">{song.name}</h1>
        <div className=" inline-flex text-xl items-center">
          {artistLinks}
          <div className=" bg-lightGrey h-2 w-2 rounded-full mx-3 inline-block" />
          <p>{song.album.release_date.substring(0, 4)}</p>
          <div className=" bg-lightGrey h-2 w-2 rounded-full mx-2 inline-block" />
          <p>{millisecondsToTime(song.duration_ms)}</p>
        </div>
      </div>
    </div>
  );
};

export default page;
