import React, { ReactNode, useState, useEffect } from "react";
import { User } from "@prisma/client";
import { Album, Artist, Track } from "@spotify/web-api-ts-sdk";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPlus,
  faStar as unfilledStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";

type UserCardProps = {
  className?: string;
  user: User;
};

// hard coded
const followersPfps: string[] = [
  "/photos/defaultPfp.png",
  "/photos/defaultPfp.png",
  "/photos/defaultPfp.png",
  "/photos/defaultPfp.png",
  "/photos/defaultPfp.png",
  "/photos/defaultPfp.png",
  "/photos/defaultPfp.png",
];

const UserCard = ({ className, user }: UserCardProps) => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [topTracks, setTopTracks] = useState<Track[] | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);

  const expandDropdown = async () => {
    // await getTopTracks();
    // await getAlbums();
    setDropdown(true);
  };

  return (
    <div className={"bg-boxLightGrey mx-auto mb-4 w-4/5 h-auto "}>
      {/* info at top -- picture, name, etc */}
      <div className="w-full h-full max-h-[11.5vh] flex p-3">
        {/* user image */}
        <img
          className="h-full aspect-square mr-2 object-cover rounded-full"
          src={user.pfp != null ? user.pfp : "/photos/defaultPfp.png"}
          alt="photo"
        />

        {/* user info */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <div className="font-bold text-xl mr-3">{user.username}</div>
            <div className="bg-white w-1 h-1 rounded-full min-w-[.25rem]" />
            <p className="ml-3 font-light text-textLightGrey">{user.name}</p>
          </div>
          <div className="font-light text-sm text-textLightGrey align-middle flex">
            <div className="inline">{user.bio}</div>
          </div>
        </div>
        <div className="flex ml-auto mr-2">
          {/* vertical divider */}
          <div className="h-4/5 w-[1px] bg-white self-center mx-4"></div>
          {/* followed by preview */}
          <div className="min-w-[11rem] max-w-[11rem]">
            <div className="font-thin text-textLightGrey m-auto">
              Followed by:
            </div>
            {/* will get up to 4 followers pfps later */}
            {!dropdown && (
              <div className="flex">
                {followersPfps.slice(0, 4).map((pfp: string): ReactNode => {
                  return (
                    <img
                      className="h-7 aspect-square object-cover rounded-full"
                      src={pfp}
                      alt="photo"
                    />
                  );
                })}
                <div className="font-thin text-textLightGrey ml-3">
                  {followersPfps.length > 4
                    ? followersPfps.length - 4 + "+"
                    : ""}
                </div>
              </div>
            )}
          </div>
          {/* drop down button */}
          <div className="flex flex-col self-center text-lg items-center">
            {/* dropdownsvg */}
            {/* root it considered public folder, so didn't prefix w /public */}
            {!dropdown && (
              <button onClick={expandDropdown}>
                <img src="/artistDropdown.svg" alt="dropdown" />
              </button>
            )}
            {dropdown && (
              <button onClick={() => setDropdown(false)}>
                <img
                  className=" rotate-180"
                  src="/artistDropdown.svg"
                  alt="dropdown"
                />
              </button>
            )}
          </div>
        </div>
      </div>
      {dropdown && (
        <div className="p-3 dropdownTransition bg-white h-auto">
          {/* top songs div */}
          <div>
            <h1 className="pr-3 w-fit border-b border-b-textLightGrey">
              Top Songs:
            </h1>
            {/* div for top song photos and text below */}
            <div className="flex pt-3">
              {/* if top tracks is null, not loaded yet, if 0 length, no results, else show results */}
              {topTracks !== null ? (
                topTracks.length === 0 ? (
                  <div>No songs</div>
                ) : (
                  topTracks.slice(0, 5).map((track: Track): ReactNode => {
                    return (
                      <div
                        className="flex flex-col w-[15%] text-sm mr-4"
                        key={track.id}
                      >
                        <img src={track.album.images[0].url} alt="photo" />
                        <div>{track.name}</div>
                      </div>
                    );
                  })
                )
              ) : (
                <div className="flex justify-start">
                  <div>Loading... Not Implemented Yet</div>
                </div>
              )}
            </div>
          </div>
          <div className=" w-full bg-textLightGrey my-3"></div>
          {/* top albums div */}
          <div>
            <h1 className="pr-3 w-fit border-b border-b-textLightGrey">
              Top Albums:
            </h1>
            {/* div for top album photos and text below */}
            <div className="flex pt-3">
              {albums !== null ? (
                albums.length === 0 ? (
                  <div>No albums</div>
                ) : (
                  albums.slice(0, 5).map((album: Album): ReactNode => {
                    return (
                      <div
                        className="flex flex-col w-[15%] text-sm mr-4"
                        key={album.id}
                      >
                        <img src={album.images[0].url} alt="photo" />
                        <div>{album.name}</div>
                      </div>
                    );
                  })
                )
              ) : (
                <div className="flex justify-start">
                  <div>Loading... Not Implemented Yet</div>
                </div>
              )}
            </div>
          </div>
          {/* top artists div */}
          <div>
            <h1 className="pr-3 w-fit border-b border-b-textLightGrey">
              Top Artists:
            </h1>
            {/* div for top artists photos and text below */}
            <div className="flex pt-3">
              {albums !== null ? (
                albums.length === 0 ? (
                  <div>No Artits</div>
                ) : (
                  albums.slice(0, 5).map((album: Album): ReactNode => {
                    return (
                      <div
                        className="flex flex-col w-[15%] text-sm mr-4"
                        key={album.id}
                      >
                        <img src={album.images[0].url} alt="photo" />
                        <div>{album.name}</div>
                      </div>
                    );
                  })
                )
              ) : (
                <div className="flex justify-start">
                  <div>Loading... Not Implemented Yet</div>
                </div>
              )}
            </div>
          </div>
          <div className="">
            {followersPfps
              .slice(0, followersPfps.length)
              .map((pfp: string): ReactNode => {
                return (
                  <img
                    className="h-7 aspect-square object-cover rounded-full mb-3"
                    src={pfp}
                    alt="photo"
                  />
                );
              })}
          </div>
          <div>follow</div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
