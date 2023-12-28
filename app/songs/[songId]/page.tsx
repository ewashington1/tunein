"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Artist, Track as Song } from "@spotify/web-api-ts-sdk";
import Link from "next/link";

const page = () => {
  const songId = useParams().songId;
  const [songDetails, setSongDetails] = useState<Song | undefined | null>(
    undefined
  );

  const fetchSongDetails = async () => {
    axios
      .get(`/api/spotify_requests/getSong/${songId}`)
      .then((res) => {
        setSongDetails(res.data.songDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // empty dependency array only renders once
  useEffect(() => {
    fetchSongDetails();
  }, []);

  if (!songDetails) {
    return <div>loading...</div>;
  }
  return (
    <div className="w-[55%] h-[100vh]">
      <SongDetailsHeader song={songDetails} />
    </div>
  );
};

const SongDetailsBody = ({ song }: { song: Song }): React.ReactNode => {
  return <div className="flex flex-col"></div>;
};

const SongDetailsHeader = ({ song }: { song: Song }): React.ReactNode => {
  const artistLinks = song.artists.map((artist, idx) => {
    return (
      <React.Fragment key={artist.id}>
        <Link href={`/artists/${artist.id}`} className=" inline font-semibold">
          {artist.name}
        </Link>
        {idx < song.artists.length - 1 && <h3 className=" inline">, </h3>}
      </React.Fragment>
    );
  });

  function millisecondsToTime(milli: number) {
    var milliseconds = milli % 1000;
    var seconds = Math.floor((milli / 1000) % 60);
    var minutes = Math.floor((milli / (60 * 1000)) % 60);

    return minutes + " min " + seconds + " sec";
  }

  return (
    <div className="flex flex-row items-center bg-boxDarkGrey w-full h-[30%] rounded-2xl mt-6">
      <img
        src={song.album.images[0].url}
        alt="photo"
        className="h-[90%] mx-3"
      />
      <div className="flex flex-col text-white justify-end gap-3">
        <h3 className="text-lg">Song</h3>
        <h1 className="font-bold text-5xl">{song.name}</h1>
        <div className=" inline-flex text-xl items-center">
          {artistLinks}
          <div className=" bg-lightGrey h-2 w-2 rounded-full mx-3 inline-block" />
          <p>{song.album.release_date.substring(0, 4)}</p>
          <div className=" bg-lightGrey h-2 w-2 rounded-full mx-2 inline-block" />
          <p>{millisecondsToTime(song.duration_ms)}</p>
        </div>
      </div>
    </div>
  );
};

export default page;
