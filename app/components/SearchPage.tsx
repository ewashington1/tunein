import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark as filledX } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark as unfilledX } from "@fortawesome/free-regular-svg-icons";
import Tracks from "./SearchResults/Tracks";
import Artists from "./SearchResults/Artists";
import Albums from "./SearchResults/Albums";

type SearchPageProps = {
  setSearchPanel: Dispatch<SetStateAction<boolean>>;
  className?: string;
  searchTerm: string;
};

const songPlaceholders = [
  {
    "album": {
      "album_type": "single",
      "artists": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju",
          },
          "href": "https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju",
          "id": "6sFIWsNpZYqfjUpaCgueju",
          "name": "Carly Rae Jepsen",
          "type": "artist",
          "uri": "spotify:artist:6sFIWsNpZYqfjUpaCgueju",
        },
      ],
      "available_markets": [],
      "external_urls": {
        "spotify": "https://open.spotify.com/album/0tGPJ0bkWOUmH7MEOR77qc",
      },
      "href": "https://api.spotify.com/v1/albums/0tGPJ0bkWOUmH7MEOR77qc",
      "id": "0tGPJ0bkWOUmH7MEOR77qc",
      "images": [
        {
          "height": 640,
          "url":
            "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
          "width": 640,
        },
        {
          "height": 300,
          "url":
            "https://i.scdn.co/image/ab67616d00001e027359994525d219f64872d3b1",
          "width": 300,
        },
        {
          "height": 64,
          "url":
            "https://i.scdn.co/image/ab67616d000048517359994525d219f64872d3b1",
          "width": 64,
        },
      ],
      "name": "Cut To The Feeling",
      "release_date": "2017-05-26",
      "release_date_precision": "day",
      "total_tracks": 1,
      "type": "album",
      "uri": "spotify:album:0tGPJ0bkWOUmH7MEOR77qc",
    },
    "artists": [
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju",
        },
        "href": "https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju",
        "id": "6sFIWsNpZYqfjUpaCgueju",
        "name": "Carly Rae Jepsen",
        "type": "artist",
        "uri": "spotify:artist:6sFIWsNpZYqfjUpaCgueju",
      },
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju",
        },
        "href": "https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju",
        "id": "6sFIWsNpZYqfjUpaCgueju",
        "name": "DooDoo FartFace",
        "type": "artist",
        "uri": "spotify:artist:6sFIWsNpZYqfjUpaCgueju",
      },
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju",
        },
        "href": "https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju",
        "id": "6sFIWsNpZYqfjUpaCgueju",
        "name": "EvanAndR",
        "type": "artist",
        "uri": "spotify:artist:6sFIWsNpZYqfjUpaCgueju",
      },
    ],
    "available_markets": [],
    "disc_number": 1,
    "duration_ms": 207959,
    "explicit": false,
    "external_ids": { "isrc": "USUM71703861" },
    "external_urls": {
      "spotify": "https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl",
    },
    "href": "https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl",
    "id": "11dFghVXANMlKmJXsNCbNl",
    "is_local": false,
    "name": "Cut To The Feeling",
    "popularity": 0,
    "preview_url": null,
    "track_number": 1,
    "type": "track",
    "uri": "spotify:track:11dFghVXANMlKmJXsNCbNl",
  },
  {
    "album": {
      "album_type": "single",
      "artists": [
        {
          "external_urls": {
            "spotify": "https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju",
          },
          "href": "https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju",
          "id": "6sFIWsNpZYqfjUpaCgueju",
          "name": "Carly Rae Jepsen",
          "type": "artist",
          "uri": "spotify:artist:6sFIWsNpZYqfjUpaCgueju",
        },
      ],
      "available_markets": [],
      "external_urls": {
        "spotify": "https://open.spotify.com/album/0tGPJ0bkWOUmH7MEOR77qc",
      },
      "href": "https://api.spotify.com/v1/albums/0tGPJ0bkWOUmH7MEOR77qc",
      "id": "0tGPJ0bkWOUmH7MEOR77qc",
      "images": [
        {
          "height": 640,
          "url":
            "https://i.scdn.co/image/ab67616d0000b2737359994525d219f64872d3b1",
          "width": 640,
        },
        {
          "height": 300,
          "url":
            "https://i.scdn.co/image/ab67616d00001e027359994525d219f64872d3b1",
          "width": 300,
        },
        {
          "height": 64,
          "url":
            "https://i.scdn.co/image/ab67616d000048517359994525d219f64872d3b1",
          "width": 64,
        },
      ],
      "name": "Cut To The Feeling",
      "release_date": "2017-05-26",
      "release_date_precision": "day",
      "total_tracks": 1,
      "type": "album",
      "uri": "spotify:album:0tGPJ0bkWOUmH7MEOR77qc",
    },
    "artists": [
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju",
        },
        "href": "https://api.spotify.com/v1/artists/6sFIWsNpZYqfjUpaCgueju",
        "id": "6sFIWsNpZYqfjUpaCgueju",
        "name": "Carly Rae Jepsen",
        "type": "artist",
        "uri": "spotify:artist:6sFIWsNpZYqfjUpaCgueju",
      },
    ],
    "available_markets": [],
    "disc_number": 1,
    "duration_ms": 207959,
    "explicit": false,
    "external_ids": { "isrc": "USUM71703861" },
    "external_urls": {
      "spotify": "https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl",
    },
    "href": "https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl",
    "id": "11dFghVXANMlKmJXsNCbNl",
    "is_local": false,
    "name": "Cut To The Feeling",
    "popularity": 0,
    "preview_url": null,
    "track_number": 1,
    "type": "track",
    "uri": "spotify:track:11dFghVXANMlKmJXsNCbNl",
  },
];

//fix the formatting of this whole panel
const SearchPage = ({
  setSearchPanel,
  className,
  searchTerm,
}: SearchPageProps) => {
  const [selectedSearchCategory, setSelectedSearchCategory] =
    useState<String>("users");

  return (
    // padding right in outer div for scrollbar offset from side
    <div
      className={
        "h-screen w-[60vw] bg-boxDarkGrey flex flex-col absolute top-0 right-[20vw] z-40 searchSlideIn pr-2 " +
        className
      }
    >
      <div className="bg-white absolute h-3/5 w-[1px] mt-[20vh]"></div>
      <div className="w-full">
        <button
          onClick={() => setSearchPanel(false)}
          className="float-right m-4"
        >
          <FontAwesomeIcon className="text-white h-8" icon={unfilledX} />
        </button>
      </div>

      <div className="flex justify-center mt-0 font-semibold text-xl">
        <div
          className={
            "px-4 border-r " +
            (selectedSearchCategory === "users" && "text-purple")
          }
        >
          <button onClick={() => setSelectedSearchCategory("users")}>
            Users
          </button>
        </div>

        <div
          className={
            "px-4 border-r " +
            (selectedSearchCategory === "songs" && "text-purple")
          }
        >
          <button onClick={() => setSelectedSearchCategory("songs")}>
            Songs
          </button>
        </div>
        <div
          className={
            "px-4 border-r " +
            (selectedSearchCategory === "albums" && "text-purple")
          }
        >
          <button onClick={() => setSelectedSearchCategory("albums")}>
            Albums
          </button>
        </div>
        <div
          className={
            "px-4 " + (selectedSearchCategory === "artists" && "text-purple")
          }
        >
          <button onClick={() => setSelectedSearchCategory("artists")}>
            Artists
          </button>
        </div>
      </div>
      {/* map through all songs in request */}
      {selectedSearchCategory === "songs" && <Tracks searchTerm={searchTerm} />}
      {selectedSearchCategory === "artists" && (
        <Artists searchTerm={searchTerm} />
      )}
      {selectedSearchCategory === "albums" && (
        <Albums searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default SearchPage;
