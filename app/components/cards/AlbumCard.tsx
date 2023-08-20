import React, { ReactNode } from "react";
import { Album, Track } from "@spotify/web-api-ts-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPlus,
  faStar as unfilledStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";
import NewStarRatingAlbum from "../MyStarRatingAlbum";

type AlbumCardProps = {
  className?: string;
  album: Album;
};

const AlbumCard = ({ className, album }: AlbumCardProps) => {
  return (
    <div className="bg-boxLightGrey mx-auto mb-4 w-4/5 h-auto">
      <div className="w-full h-full flex p-2 max-h-[10.5vh]">
        <img src={album.images[0].url} alt="" className="h-full mr-2" />
        {/* song info */}
        <div className="flex flex-col justify-center">
          <div className="font-bold text-xl">{album.name}</div>
          <div className="font-light text-sm text-textLightGrey align-middle flex">
            <div className="inline">Album</div>
            <div className="w-1 h-1 bg-textLightGrey rounded-full inline-block mx-1 my-auto"></div>
            <div className="inline">
              {/* make each link to artist */}
              {album.artists.map((artist) => artist.name).join(", ")}
            </div>
          </div>
        </div>
        <div className="flex ml-auto mr-2">
          {/* add to playlist button */}
          <button className="self-center">
            <FontAwesomeIcon
              className="align-middle w-8 h-8 p-2 rounded-full border border-white text-purple"
              icon={faPlus}
            />
          </button>
          {/* vertical divider between two */}
          <div className="h-4/5 w-[1px] bg-white self-center mx-4"></div>
          {/* my rating */}
          <div className="flex flex-col self-center text-lg items-center">
            <div>My rating:</div>
            <NewStarRatingAlbum album={album} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
