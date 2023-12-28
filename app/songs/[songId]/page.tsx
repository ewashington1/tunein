"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Artist, Track as Song } from "@spotify/web-api-ts-sdk";
import Link from "next/link";
import CommentPage from "@/app/components/CommentPage";
import { CommentsWithUsernames } from "@/app/types";
import { useSession } from "next-auth/react";

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
      <SongCommentsSection songId={songDetails.id} />
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
  const [comments, setComments] = useState<CommentsWithUsernames[] | null>(
    null
  );
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
    <div className="flex flex-col max-h-[50vh] p-5" style={commentSectionStyle}>
      <div className="text-4xl font-semibold">Comments</div>
      {/* <hr /> */}
      <div>
        {comments ? (
          comments.map((existingComment) => (
            <div className="flex gap-1 py-1 border-b-[1px] border-white text-center">
              <div
                className={`ml-2 font-bold text-lg ${
                  session?.user.id === existingComment.userId && "text-purple"
                }`}
              >{`@${existingComment.user.username}:`}</div>
              <div className="text-textLightGrey text-lg">
                {existingComment.comment}
              </div>
            </div>
          ))
        ) : (
          <div>Loading comments...</div>
        )}
      </div>

      <input
        className="text-white font-extralight font-xl mt-2 bg-transparent mx-2 focus:outline-none"
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
    </div>
  );
};

// song details body
const SongDetailsBody = ({ song }: { song: Song }): React.ReactNode => {
  const popularityBarStyle = `h-full w-[${song.popularity}%] bg-purple`;
  return (
    <div className="flex flex-col text-xl">
      <p className="flex-row flex items-center">
        Popularity:
        <div className=" h-4 flex-grow bg-lightGrey mx-3" id="popularityBar">
          <div className={popularityBarStyle} />
        </div>
        {song.popularity}
      </p>
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
