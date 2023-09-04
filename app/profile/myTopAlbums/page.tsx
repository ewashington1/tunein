"use client";
import AuthenticatedLayout from "@/app/components/layout/AuthenticatedLayout";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Album, TopAlbums, TopAlbumsAlbum, User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import TopAlbumsAlbumCard from "./TopAlbumsAlbumCard";

interface TopAlbumsAlbumWithAlbum extends TopAlbumsAlbum {
  album: Album;
}

interface TopAlbumsWithAlbum extends TopAlbums {
  albums: [TopAlbumsAlbumWithAlbum];
  user: User;
}

const page = () => {
  const { data: session, status } = useSession();

  const [topAlbums, setTopAlbums] = useState<TopAlbumsWithAlbum | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const getTopAlbums = async () => {
    axios
      .get(`/api/prisma/getTopAlbumsWithAlbums/${session!.user.id}`)
      .then((res) => {
        setTopAlbums(res.data);
      })
      .then((err) => {
        console.log(err);
      });
  };

  const removeFromTopAlbums = async (albumId: string) => {
    axios
      .delete("/api/prisma/removeFromTopAlbums/" + albumId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setTopAlbums((prevTopAlbums: any) => {
      if (!prevTopAlbums || !prevTopAlbums.albums) return prevTopAlbums; // Return previous state if null or songs undefined

      return {
        ...prevTopAlbums,
        albums: prevTopAlbums.albums.filter(
          (album: any) => album.albumId !== albumId
        ),
      };
    });
  };

  useEffect(() => {
    if (status === "authenticated") {
      getTopAlbums();
    }
  }, [session]);

  if (topAlbums === null) return <AuthenticatedLayout></AuthenticatedLayout>;

  return (
    <AuthenticatedLayout>
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
            <div className="font-bold text-6xl">My Top Albums</div>
          </div>

          {/* edit button */}
          {status === "authenticated" &&
            session!.user!.id === topAlbums.userId && (
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
          {topAlbums.albums &&
            topAlbums.albums.map((topAlbumsAlbum: TopAlbumsAlbumWithAlbum) => {
              return (
                <TopAlbumsAlbumCard
                  key={topAlbumsAlbum.albumId}
                  topAlbumsAlbum={topAlbumsAlbum}
                  editMode={editMode}
                  removeFromTopAlbums={removeFromTopAlbums}
                />
              );
            })}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default page;
