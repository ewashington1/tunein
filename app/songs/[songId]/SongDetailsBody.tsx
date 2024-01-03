import React from "react";
import { Track as Song } from "@spotify/web-api-ts-sdk";

export const SongDetailsBody = ({
  song,
}: {
  song: Song | undefined;
}): React.ReactNode => {
  return (
    <div className="flex flex-col text-xl">
      <div className="flex-row flex items-center">
        Popularity:
        <div className=" h-4 flex-grow bg-lightGrey mx-3" id="popularityBar">
          <div
            className={`h-full bg-purple`}
            style={{ width: `${song ? song.popularity : 0}%` }}
          />
        </div>
        {song ? song.popularity : 0}
      </div>
    </div>
  );
};
