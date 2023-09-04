import { Album } from "@prisma/client";
import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

type TopAlbumsAlbumCardProps = {
  topAlbumsAlbum: { album: Album; topAlbumsId: string; albumId: string };
  editMode: boolean;
  removeFromTopAlbums: (albumId: string) => Promise<void>;
};

const TopAlbumsAlbumCard = ({
  topAlbumsAlbum,
  editMode,
  removeFromTopAlbums,
}: TopAlbumsAlbumCardProps) => {
  return (
    <div className="flex items-center gap-2 w-full h-auto bg-boxLightGrey p-2 my-2">
      {/* image */}
      <Image
        src={topAlbumsAlbum.album.image_url}
        alt="cover"
        height={75}
        width={75}
      />
      {/* song details */}
      <div className="flex flex-col justify-center">
        <div className="font-bold text-2xl">{topAlbumsAlbum.album.name}</div>
        <div className="flex items-center gap-1 font-extralight text-md text-textLightGrey">
          <div>Song</div>
          <div className="w-1 h-1 bg-textLightGrey rounded-full"></div>
          <div>{topAlbumsAlbum.album.name}</div>
        </div>
      </div>
      <div className="ml-auto">
        {editMode && (
          <button
            onClick={() => removeFromTopAlbums(topAlbumsAlbum.albumId)}
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

export default TopAlbumsAlbumCard;
