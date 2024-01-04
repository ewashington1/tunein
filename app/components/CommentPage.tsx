import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Rating } from "react-simple-star-rating";
import { Artist, SongRating } from "@prisma/client";
import { FeedItem } from "../home/page";
import axios from "axios";
import { CommentsWithUsernames } from "../types";
import { useSession } from "next-auth/react";

const CommentPage = ({
  setCommentModalOpen,
  song,
}: {
  setCommentModalOpen: Dispatch<SetStateAction<boolean>>;
  song: FeedItem;
}) => {
  const close = (e: any) => {
    if (e.target!.id == "outside" || e.target.id === "cancel") {
      setCommentModalOpen(false);
    }
  };

  const { data: session } = useSession();

  const [playMarquee, setPlayMarquee] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const [comments, setComments] = useState<CommentsWithUsernames[] | undefined>(
    undefined
  );

  const fetchComments = async () => {
    axios
      .get(`/api/prisma/comments/getComments/${song.id}`)
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const submit = () => {
    axios
      .post("/api/prisma/comments/addComment", {
        comment: comment,
        songId: song.id,
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
        alert("Failure");
      });
  };

  const removeComment = () => {
    axios
      .delete("/api/prisma/comments/deleteComment/" + song.id)
      .then(() => {
        setComments((prevComments) => {
          return prevComments?.filter((comment) => {
            return comment.userId != session?.user.id;
          });
        });
      })
      .catch((err) => {
        alert("Attempt failed.");
      })
  };

  return (
    // background
    <div
      className="inset-0 fixed flex justify-center items-center bg-white bg-opacity-25 backdrop-blur-sm z-50"
      id="outside"
      onClick={close}
    >
      {/* modal */}
      <div className="w-3/5 bg-boxLightGrey h-4/5 flex flex-col m-auto rounded-lg overflow-hidden p-2">
        {/* header container */}
        <div className="h-1/3 bg-boxDarkGrey flex flex-col p-2 rounded-md">
          <div className="h-4/5 flex">
            <Image
              src={song.image_url}
              alt="cover"
              className="w-auto h-auto"
              height={200}
              width={200}
            />
            <div className=" flex flex-col justify-center mx-2">
              <div className="text-2xl text-textLightGrey font-extralight">
                Song
              </div>
              <div className="text-5xl text-white font-bold whitespace-nowrap textSlide">
                {song.name}
              </div>
              <div className="text-3xl text-textLightGrey font-extralight whitespace-nowrap textSlide">
                {song.artists.map((artist: Artist) => artist.name).join(", ")}
              </div>
            </div>
          </div>
          <div className="h-[1px] w-auto mt-2 bg-white" />
          <div
            className="h-auto w-auto my-auto"
            onMouseEnter={() => setPlayMarquee(true)}
            onMouseLeave={() => setPlayMarquee(false)}
          >
            <Marquee play={playMarquee} speed={250}>
              {song.songRatings!.map(
                (songRating: SongRating & { user: { username: string } }) => (
                  <div
                    className="flex items-center mr-5"
                    key={songRating.userId}
                  >
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
                )
              )}
            </Marquee>
          </div>
        </div>
        <div className="pr-4 overflow-y-scroll commentSectionScrollbar">
          <div className="flex flex-col items-start">
            {comments && comments.length !== 0 ? (
              comments.map((existingComment) => (

                <div className="pl-2 py-1 border-b-[1px] border-white w-full">
                  <p
                    className={`font-bold text-lg inline ${
                      session?.user.id === existingComment.userId &&
                      "text-purple"
                    }`}
                  >{`@${existingComment.user.username}: `}</p>

                  <div className="text-textLightGrey inline text-lg">
                    {existingComment.comment}
                  </div>
                  
                  {session?.user.id === existingComment.userId && <div className="inline"
                    onClick={removeComment}
                  >
                    delete
                  </div>}

                </div>
              ))
            ) : comments ? (
              <div>No comments</div>
            ) : (
              <div>Loading comments...</div>
            )}
          </div>
        </div>
        <div className="h-[1px] w-auto bg-white mt-auto" />
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
              className={
                comment ? " h-6 w-6 opacity-75" : " h-6 w-6 opacity-25"
              }
            />
          </button>
        </span>
      </div>
    </div>
  );
};

export default CommentPage;
