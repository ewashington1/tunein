"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark as filledX } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark as unfilledX } from "@fortawesome/free-regular-svg-icons";
import Tracks from "./SearchResults/Tracks";
import Artists from "./SearchResults/Artists";
import Albums from "./SearchResults/Albums";
import Users from "./SearchResults/Users";

type SearchPageProps = {
  setSearchPanel: Dispatch<SetStateAction<boolean>>;
  className?: string;
  searchTerm: string;
};

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
        "h-screen w-[60vw] bg-boxDarkGrey flex flex-col absolute top-0 left-full z-[-1] searchSlideIn pr-2 " +
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
      {selectedSearchCategory == "users" && <Users searchTerm={searchTerm} />}
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
