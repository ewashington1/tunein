"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import { useSession } from "next-auth/react";
import FeedSongRating from "../components/feed/FeedSongRating";
import FeedAlbumRating from "../components/feed/FeedAlbumRating";
import { Artist, AlbumRating, SongRating } from "@prisma/client";

export type FeedItem = {
  id: String;
  name: String;
  preview_url?: String;
  image_url: String;
  songRating?: SongRating;
  albumRating?: AlbumRating;
  artists: Artist;
};

const page = () => {
  const { data: session, status } = useSession();
  const [feedItems, setFeedItems] = useState<FeedItem[]>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const getSongs = async () => {
        axios
          .get("/api/prisma/getSongs/" + session?.user.id)
          .then((res) => {
            setFeedItems(res.data.feed);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getSongs();
    }
  }, [status, session]);

  //const feedItems = await request that gets all following recent ratings (that were not seen yet)

  //const [feedItems, setFeedItems] = useState<FeedItem[]>(null)

  // useEffect(async () => {
  //   axios.post("api/tunein/expandFeed", (res) => {
  //     setFeedItems([...feedItems], res.data.body.feedItems);
  //   });
  // }, [session]);

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col max-h-[100vh] overflow-y-scroll pr-5 w-1/2 darkGreyScrollbar">
        {feedItems?.map((item) => {
          // if typeof item === songRating render song card, otherwise render album rating card
          if (item.songRatings !== undefined) {
            return <FeedSongRating key={item.id} song={item} />;
          } else if (item.albumRatings !== undefined) {
            return <FeedAlbumRating key={item.id} album={item} />;
          }
        })}
        {feedItems?.length == 0 && <div>No Posts, Try Following People</div>}
      </div>
      {/* <FeedItem /> */}
    </AuthenticatedLayout>
  );
};

export default page;
