import axios from "axios";
import React, { useEffect, useState } from "react";
import { Album } from "@spotify/web-api-ts-sdk";
import AlbumCard from "../cards/AlbumCard";

type AlbumsProps = {
  searchTerm: string;
};

const Albums = ({ searchTerm }: AlbumsProps) => {
  const [albumSearchResults, setAlbumSearchResults] = useState<Album[] | null>(
    null
  );
  useEffect(() => {
    const getSearchResults = async () => {
      axios
        .post("/api/spotify_requests/searchAlbums", {
          searchTerm: searchTerm,
        })
        .then((res) => {
          setAlbumSearchResults(res.data.albums.items);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getSearchResults();
  }, [searchTerm]);
  if (albumSearchResults === null) {
    return (
      <div className="flex mt-4 font-bold h-[80vh] overflow-y-scroll justify-center text-2xl lightGreyScrollbar">
        <div>Loading album results...</div>
      </div>
    );
  } else if (albumSearchResults.length === 0) {
    return (
      <div className="flex mt-4 font-bold h-[80vh] overflow-y-scroll justify-center text-2xl lightGreyScrollbar">
        <div>No results :(</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col mt-4 h-[80vh] overflow-y-scroll lightGreyScrollbar">
      {albumSearchResults.map((album) => (
        // fix type error
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
};

export default Albums;
