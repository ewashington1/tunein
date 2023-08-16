import axios from "axios";
import React, { useEffect, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import SongCard from "../cards/SongCard";

type TracksProps = {
  searchTerm: string;
};

const Tracks = ({ searchTerm }: TracksProps) => {
  const [songSearchResults, setSongSearchResults] = useState<Track[] | null>(
    null
  );
  useEffect(() => {
    const getSearchResults = async () => {
      axios
        .post("/api/spotify_requests/searchSongs", {
          searchTerm: searchTerm,
        })
        .then((res) => {
          setSongSearchResults(res.data.tracks.items);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getSearchResults();
  }, [searchTerm]);
  if (songSearchResults === null) {
    return (
      <div className="flex mt-4 font-bold h-[80vh] overflow-y-scroll justify-center text-2xl lightGreyScrollbar">
        <div>Loading song results...</div>
      </div>
    );
  } else if (songSearchResults.length === 0) {
    return (
      <div className="flex mt-4 font-bold h-[80vh] overflow-y-scroll justify-center text-2xl lightGreyScrollbar">
        <div>No results :(</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col mt-4 h-[80vh] overflow-y-scroll lightGreyScrollbar">
      {songSearchResults.map((track) => (
        // fix type error
        <SongCard key={track.id} track={track} />
      ))}
    </div>
  );
};

export default Tracks;
