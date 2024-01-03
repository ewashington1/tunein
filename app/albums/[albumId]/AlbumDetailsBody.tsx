import React from "react";
import { Album } from "@spotify/web-api-ts-sdk";

// album details body
export const AlbumDetailsBody = ({
  album,
}: {
  album: Album | undefined;
}): React.ReactNode => {
  return (
    <div className="flex flex-col text-xl">
      <div className="flex-row flex items-center">
        Popularity:
        <div className=" h-4 flex-grow bg-lightGrey mx-3" id="popularityBar">
          <div
            className={`h-full bg-purple`}
            style={{ width: `${album ? album.popularity : 0}%` }}
          />
        </div>
        {album ? album.popularity : 0}
      </div>
    </div>
  );
};
