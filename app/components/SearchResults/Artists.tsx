import axios from "axios";
import React, { useEffect, useState } from "react";
import { Artist } from "@spotify/web-api-ts-sdk";
import ArtistCard from "../cards/ArtistCard";

type ArtistsProps = {
  searchTerm: string;
};

const Artists = ({ searchTerm }: ArtistsProps) => {
  const [artistSearchResults, setArtistSearchResults] = useState<
    Artist[] | null
  >(null);
  useEffect(() => {
    const getSearchResults = async () => {
      axios
        .post("/api/spotify_requests/searchArtists", {
          searchTerm: searchTerm,
        })
        .then((res) => {
          setArtistSearchResults(res.data.artists.items);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getSearchResults();
  }, [searchTerm]);
  if (artistSearchResults === null || artistSearchResults === undefined) {
    return (
      <div className="flex mt-4 font-bold h-[80vh] overflow-y-scroll justify-center text-2xl lightGreyScrollbar">
        <div>Loading artist results...</div>
      </div>
    );
  } else if (artistSearchResults.length === 0) {
    return (
      <div className="flex mt-4 font-bold h-[80vh] overflow-y-scroll justify-center text-2xl lightGreyScrollbar">
        <div>No results :(</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col mt-4 h-[80vh] overflow-y-scroll lightGreyScrollbar">
      {artistSearchResults.map((artist) => (
        // fix type error
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
};

export default Artists;
