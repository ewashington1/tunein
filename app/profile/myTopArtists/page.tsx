"use client";

import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Artist, TopArtists, TopArtistsArtist, User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import TopArtistsArtistCard from "./TopArtistsArtistCard";

interface TopArtistsArtistWithArtist extends TopArtistsArtist {
  artist: Artist;
}

interface TopArtistsWithArtist extends TopArtists {
  artists: [TopArtistsArtistWithArtist];
  user: User;
}

const page = () => {
  const { data: session, status } = useSession();

  const [topArtists, setTopArtists] = useState<TopArtistsWithArtist | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const getTopArtists = async () => {
    axios
      .get(`/api/prisma/top/getTopArtistsWithArtists/${session!.user.id}`)
      .then((res) => {
        setTopArtists(res.data);
      })
      .then((err) => {
        console.log(err);
      });
  };

  const removeFromTopArtists = async (artistId: string) => {
    console.log(topArtists);

    axios
      .delete("/api/prisma/top/removeFromTopArtists/" + artistId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setTopArtists((prevTopArtists: any) => {
      if (!prevTopArtists || !prevTopArtists.artists) return prevTopArtists; // Return previous state if null or songs undefined

      return {
        ...prevTopArtists,
        artists: prevTopArtists.artists.filter(
          (artist: any) => artist.artistId !== artistId
        ),
      };
    });
  };

  useEffect(() => {
    if (status === "authenticated") {
      getTopArtists();
    }
  }, [session]);

  if (topArtists === null) return <></>;

  return (
    <>
      {/* full container */}
      <div className="w-1/2 h-[95vh] my-4 relative flex flex-col">
        {/* top - title, owner, description, edit option, save btn */}
        <div className="w-full min-h-[22.5vh] h-[22.5vh] bg-boxDarkGrey rounded-lg flex p-4 relative">
          <div className=" bg-bgGrey h-[9.5rem] w-[9.5rem] p-4 text-center">
            <FontAwesomeIcon
              className="text-white w-full h-full"
              icon={faStar}
            />
          </div>
          {/* name, owner name, description */}
          <div className="flex flex-col ml-4 justify-center">
            <div className="font-bold text-6xl">My Top Artists</div>
          </div>

          {/* edit button */}
          {status === "authenticated" &&
            session!.user!.id === topArtists.userId && (
              <>
                {!editMode ? (
                  <button
                    onClick={toggleEditMode}
                    className="bg-lightGrey absolute top-2 right-2 rounded-full p-1 w-10 h-10"
                  >
                    <img
                      className="w-6 m-auto"
                      src="/purplePencil.svg"
                      alt="pencil"
                    />
                  </button>
                ) : (
                  <button
                    onClick={toggleEditMode}
                    className="bg-purple absolute top-2 right-2 rounded-full p-1 w-10 h-10 pencilEditAnimation"
                  >
                    <img
                      className="w-6 m-auto stroke-white"
                      src="/whitePencil.svg"
                      alt="pencil"
                    />
                  </button>
                )}
              </>
            )}
        </div>
        {/* actual song cards -- maps through pivot table objects (SongPlaylist)*/}

        <div className="h-auto overflow-y-scroll flex-grow darkGreyScrollbar">
          {topArtists.artists &&
            topArtists.artists.map(
              (topArtistsArtist: TopArtistsArtistWithArtist) => {
                return (
                  <TopArtistsArtistCard
                    key={topArtistsArtist.artistId}
                    topArtistsArtist={topArtistsArtist}
                    editMode={editMode}
                    removeFromTopArtists={removeFromTopArtists}
                  />
                );
              }
            )}
        </div>
      </div>
    </>
  );
};

export default page;
