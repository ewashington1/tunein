"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchPage from "../SearchPage";
import CreatePlaylistModal from "../playlists/CreatePlaylistModal";
import SidebarPlaylists from "../playlists/SidebarPlaylists";

const LeftSideBar = () => {
  const pathname = usePathname();
  const paths = {
    root: pathname === "/root" ? "text-purple" : "text-white",
    home: pathname === "/home" ? "text-purple" : "text-white",
    explore: pathname === "/explore" ? "text-purple" : "text-white",
  };

  const [searchPanel, setSearchPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);

  return (
    <div className="fixed left-0 h-full z-50">
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
        <input
          onClick={() => setSearchPanel(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mx-4 my-4 bg-bgGrey rounded-full py-2 px-4 w-4/5 caret-lightGrey outline-none text-lightGrey"
          type="text"
          placeholder="Search"
        />
        <SidebarPlaylists />
        <button
          onClick={() => setPlaylistModalOpen(true)}
          className=" bg-purple mt-auto mb-6 py-2 px-3 h-auto self-center text-lightGrey font-bold text-xl rounded-md text-center"
        >
          Create Playlist
        </button>
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
