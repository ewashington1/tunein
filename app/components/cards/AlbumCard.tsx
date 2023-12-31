import React, { useState } from "react";
import { Album } from "@spotify/web-api-ts-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import NewStarRatingAlbum from "@/app/components/myRatings/MyStarRatingAlbumSpotify";
import { createPortal } from "react-dom";
import AddToTopAlbumsModal from "./AddToTopAlbumsModal";

type AlbumCardProps = {
  className?: string;
  album: Album;
};

const AlbumCard = ({ className, album }: AlbumCardProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <div className="bg-boxLightGrey mx-auto mb-4 w-4/5 h-auto">
      <div className="w-full h-full flex p-2 max-h-[10.5vh]">
        <img src={album.images[0].url} alt="" className="h-full mr-2" />
        {/* song info */}
        <div className="flex flex-col justify-center overflow-hidden">
          <div className="font-bold text-xl whitespace-nowrap">
            {album.name}
          </div>
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
          <button className="self-center" onClick={() => setModalOpen(true)}>
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
      {modalOpen &&
        createPortal(
          <AddToTopAlbumsModal
            album={album}
            setAddToTopAlbumsOpen={setModalOpen}
          />,
          document.body
        )}
    </div>
  );
};

export default AlbumCard;
