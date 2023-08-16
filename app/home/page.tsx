"use client";

import axios from "axios";
import React, { useEffect } from "react";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import { useSession } from "next-auth/react";
import { SongRating, AlbumRating } from "@prisma/client";
import FeedSongRating from "../components/FeedSongRating";
import FeedAlbumRating from "../components/FeedAlbumRating";

export type FeedItem = {
  songId?: string;
  albumId?: string;
  stars: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

const feedItems: FeedItem[] = [
  {
    songId: "0gJts3ROQ3TAnkff8JlOww",
    stars: 1,
    userId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    songId: "0JGQASbzeUjibbQp2Eu0Yv",
    stars: 2,
    userId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    songId: "16bHRxM89ue0TiCKARYbRp",
    stars: 4,
    userId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    songId: "16bHRxM89ue0TiCKARYbRp",
    stars: 4,
    userId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    songId: "16bHRxM89ue0TiCKARYbRp",
    stars: 4,
    userId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const page = () => {
  const getTestSong = () => {
    axios.post("/api/spotify_requests/getSongTest").then((res) => {
      console.log(res.data.body);
    });
  };

  const { data: session, status } = useSession();

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
        {feedItems.map((item, index) => {
          // if typeof item === songRating render song card, otherwise render album rating card
          if (item.songId !== null) {
            return <FeedSongRating key={index} songRating={item} />;
          } else {
            return <FeedAlbumRating key={index} albumRating={item} />;
          }
        })}
      </div>
      {/* <FeedItem /> */}
    </AuthenticatedLayout>
  );
};

export default page;
