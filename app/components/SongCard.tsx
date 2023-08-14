import React, { ReactNode } from "react";
import { Track } from "@spotify/web-api-ts-sdk";

type SongCardProps = {
  className?: string;
  track: Track;
};

const SongCard = ({ className, track }: SongCardProps) => {
  return (
    <div className="bg-boxLightGrey mx-auto mb-4 w-4/5 h-[12.5%] flex">
      <img
        src={track.album.images[0].url}
        alt=""
        className="h-4/5 ml-2 my-auto"
      />
      <div className="flex flex-col justify-center ml-2">
        <div className="font-bold text-xl">{track.name}</div>
        <div className="font-light text-sm text-textLightGrey align-middle flex">
          <div className="inline">Song</div>
          <div className="w-1 h-1 bg-textLightGrey rounded-full inline-block mx-1 my-auto"></div>
          <div className="inline">
            {/* make each link to artist */}
            {track.artists.map((artist) => artist.name).join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
