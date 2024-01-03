import React from "react";
import { Album } from "@spotify/web-api-ts-sdk";
import Link from "next/link";

//album details header
export const AlbumDetailsHeader = ({
  album,
}: {
  album: Album | undefined;
}): React.ReactNode => {
  const artistLinks = () =>
    album!.artists.map((artist, idx) => {
      return (
        <React.Fragment key={artist.id}>
          <Link
            href={`/artists/${artist.id}`}
            className=" inline font-semibold hover:underline"
          >
            {artist.name}
          </Link>
          {idx < album!.artists.length - 1 && (
            <h3 className=" inline">,&nbsp; </h3>
          )}
        </React.Fragment>
      );
    });

  return (
    <div className="flex flex-row items-center bg-boxDarkGrey w-full h-[30%] rounded-2xl mt-6">
      <img
        src={album ? album.images[0].url : "/photos/defaultPlaylistImage.png"}
        alt="photo"
        className="h-[90%] mx-3"
      />
      <div className="flex flex-col text-white justify-end gap-3">
        <h3 className="text-lg">Album</h3>
        <h1 className="font-bold text-5xl">{album ? album.name : "Name"}</h1>
        {album ? (
          <div className=" inline-flex text-xl items-center">
            {artistLinks()}
            <div className=" bg-lightGrey h-2 w-2 rounded-full mx-3 inline-block" />
            <p>{album.release_date.substring(0, 4)}</p>
            <div className=" bg-lightGrey h-2 w-2 rounded-full mx-2 inline-block" />
            <p>{`${album.total_tracks} songs`}</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
