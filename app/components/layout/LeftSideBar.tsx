"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchPage from "../SearchPage";
import CreatePlaylistModal from "../playlists/CreatePlaylistModal";
import SidebarPlaylists from "../playlists/SidebarPlaylists";
import { setTimeout } from "timers";

const LeftSideBar = () => {
  const pathname = usePathname();
  const paths = {
    root: pathname === "/root" ? "text-purple" : "text-white",
    home: pathname === "/home" ? "text-purple" : "text-white",
    explore: pathname === "/explore" ? "text-purple" : "text-white",
  };

  const Input = () => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Enter") {
        setSearchTerm(event.target.value);
      }
    };

    return (
      <input
        onClick={() => setSearchPanel(true)}
        // onChange={(e) => }
        onBlur={(e) => setSearchTerm(e.target.value)}
        className="mx-4 my-4 bg-bgGrey rounded-full py-2 px-4 w-4/5 caret-lightGrey outline-none text-lightGrey"
        type="text"
        placeholder="Search"
        onKeyDown={handleKeyDown}
        defaultValue={searchTerm}
      />
    );
  };

  const [searchPanel, setSearchPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);

  return (
    <div className="fixed left-0 h-full z-40">
      <div className="bg-boxDarkGrey h-full w-[20vw] flex flex-col">
        <div className={"font-extrabold text-6xl mx-4 my-4 " + paths.root}>
          <Link href="/">TuneIn</Link>
        </div>
        <hr className="mx-4 w-4/5" />
        <div
          className={"font-semibold text-3xl mx-4 my-4 " + paths.home}
          id="home"
        >
          <Link href="/home">Home</Link>
        </div>
        <hr className="mx-4 w-2/5" />
        <div
          className={"font-semibold text-3xl mx-4 my-4 " + paths.explore}
          id="explore"
        >
          <Link href="/explore">Explore</Link>
        </div>
        <hr className="mx-4 w-3/5" />
        <Input />
        <div className="h-auto flex flex-col mt-auto">
          <SidebarPlaylists />
          <button
            onClick={() => setPlaylistModalOpen(true)}
            className=" bg-purple mt-2 mb-6 py-2 px-3  h-auto self-center text-lightGrey font-bold text-xl rounded-md text-center"
          >
            Create Playlist
          </button>
        </div>
      </div>
      {searchPanel && (
        <SearchPage searchTerm={searchTerm} setSearchPanel={setSearchPanel} />
      )}

      {playlistModalOpen && (
        <CreatePlaylistModal setPlaylistModalOpen={setPlaylistModalOpen} />
      )}
    </div>
  );
};

export default LeftSideBar;
