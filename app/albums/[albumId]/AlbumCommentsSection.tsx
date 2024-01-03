import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { CommentsWithUsernames } from "@/app/types";
import { useSession } from "next-auth/react";

// comments section
const commentSectionStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

export const AlbumCommentsSection = ({ albumId }: { albumId: string }) => {
  const { data: session } = useSession();

  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<
    CommentsWithUsernames[] | undefined | null
  >(undefined);
  const fetchComments = async () => {
    axios
      .get(`/api/prisma/comments/getComments/${albumId}`)
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
        albumId: albumId,
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
