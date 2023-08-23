import { Track } from "@spotify/web-api-ts-sdk";
import React from "react";
import Image from "next/image";
import { Song } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

type PlaylistSongCardProps = {
  playlistSong: { song: Song; playlistId: string; songId: string };
  editMode: boolean;
  removeFromPlaylists: (songId: string, playlistId: string) => Promise<void>;
};

const PlaylistSongCard = ({
  playlistSong,
  editMode,
  removeFromPlaylists,
}: PlaylistSongCardProps) => {
  return (
    <div className="flex items-center gap-2 w-full h-auto bg-boxLightGrey p-2 my-2">
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
      <div className="ml-auto">
        {editMode && (
          <button
            onClick={() =>
              removeFromPlaylists(playlistSong.songId, playlistSong.playlistId)
            }
            className="flex items-center rounded-full h-12 w-12 border border-white"
          >
            <FontAwesomeIcon
              className="m-auto text-2xl h-10 w-10"
              icon={faMinus}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistSongCard;
