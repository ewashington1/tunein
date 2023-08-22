import { Track } from "@spotify/web-api-ts-sdk";
import React from "react";
import Image from "next/image";
import { Song } from "@prisma/client";

type PlaylistSongCardProps = {
  playlistSong: { song: Song };
  editMode: boolean;
};

const PlaylistSongCard = ({
  playlistSong,
  editMode,
}: PlaylistSongCardProps) => {
  return (
    <div className="flex gap-2 w-full h-auto bg-boxLightGrey p-2 my-2">
      {/* image */}
      <Image
        src={playlistSong.song.image_url}
        alt="cover"
        height={75}
        width={75}
      />
      {/* song details */}
      <div className="flex flex-col justify-center">
        <div className="font-bold text-2xl">{playlistSong.song.name}</div>
        <div className="flex items-center gap-1 font-extralight text-md text-textLightGrey">
          <div>Song</div>
          <div className="w-1 h-1 bg-textLightGrey rounded-full"></div>
          <div>{playlistSong.song.name}</div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSongCard;
