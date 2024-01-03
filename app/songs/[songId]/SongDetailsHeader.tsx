import React from "react";
import { Track as Song } from "@spotify/web-api-ts-sdk";
import Link from "next/link";

//song details header
export const SongDetailsHeader = ({
  song,
}: {
  song: Song | undefined;
}): React.ReactNode => {
  const artistLinks = () =>
    song!.artists.map((artist, idx) => {
      return (
        <React.Fragment key={artist.id}>
          <Link
            href={`/artists/${artist.id}`}
            className=" inline font-semibold hover:underline"
          >
            {artist.name}
          </Link>
          {idx < song!.artists.length - 1 && (
            <h3 className=" inline">,&nbsp; </h3>
          )}
        </React.Fragment>
      );
    });

  function millisecondsToTime(milli: number) {
    var seconds = Math.floor((milli / 1000) % 60);
    var minutes = Math.floor((milli / (60 * 1000)) % 60);

    return minutes + " min " + seconds + " sec";
  }

  return (
    <div className="flex flex-row items-center bg-boxDarkGrey w-full h-[30%] rounded-2xl mt-6">
      <img
        src={
          song ? song.album.images[0].url : "/photos/defaultPlaylistImage.png"
        }
        alt="photo"
        className="h-[90%] mx-3"
      />
      <div className="flex flex-col text-white justify-end gap-3">
        <h3 className="text-lg">Song</h3>
        <h1 className="font-bold text-5xl">{song ? song.name : "Name"}</h1>
        {song ? (
          <div className=" inline-flex text-xl items-center">
            {artistLinks()}
            <div className=" bg-lightGrey h-2 w-2 rounded-full mx-3 inline-block" />
            <p>{song.album.release_date.substring(0, 4)}</p>
            <div className=" bg-lightGrey h-2 w-2 rounded-full mx-2 inline-block" />
            <p>{millisecondsToTime(song.duration_ms)}</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
