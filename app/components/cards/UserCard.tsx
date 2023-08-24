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
import { useSession } from "next-auth/react";

type UserCardProps = {
  className?: string;
  user: User;
};

const followersUserNames: string[] = ["Mutaz03"];

const followersNames: string[] = ["Mutaz B"];

const UserCard = ({ className, user }: UserCardProps) => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [topTracks, setTopTracks] = useState<Track[] | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const [followers, setFollowers] = useState<User[] | null>(null);

  const { data: session } = useSession();

  if (session?.user.id == user.id) {
    return;
  }

  useEffect(() => {
    const getFollowers = async () => {
      axios
        .get("/api/prisma/getFollowers/" + session?.user!.id + "/" + user.id)
        .then((res) => {
          setFollowers(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getFollowers();
  }, []);

  const getFollow = async () => {
    axios
      .get("/api/prisma/getFollow/" + session?.user!.id + "/" + user.id)
      .then((res) => {
        setFollowing(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const expandDropdown = async () => {
    // await getTopTracks();
    // await getAlbums();
    await getFollow();
    setDropdown(true);
  };

  const follow = async () => {
    axios
      .get("/api/prisma/follow/" + session?.user!.id + "/" + user.id)
      .then((res) => {
        setFollowing(!following);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unfollow = async () => {
    axios
      .get("/api/prisma/unfollow/" + session?.user!.id + "/" + user.id)
      .then((res) => {
        setFollowing(!following);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={"flex bg-boxLightGrey mx-auto mb-4 w-4/5 h-auto"}>
      {/* the left flex box*/}
      <div className="max-w-[60%] h-full min-w-[60%]">
        {/* info at top -- picture, name, etc */}
        <div className="max-w-[60%] h-full max-h-[11.5vh] flex p-3">
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
        </div>

        {/* drop down left side items */}
        {dropdown && (
          <div className="p-3 dropdownTransition h-auto">
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
          </div>
        )}
      </div>
      {/* right flex box */}
      <div className="flex w-full">
        {/* vertical divider */}
        {followers !== null && followers.length > 0 && (
          <div className="h-4/5 w-[1px] bg-white self-center mx-4"></div>
        )}
        {/* spacing for follow button if there is no followers */}
        {(followers === null || followers.length <= 0) && (
          <div className="ml-8"></div>
        )}
        <div className="flex flex-col">
          {/* flex box that only appears when there should be followed by section */}
          {followers !== null && followers.length > 0 && (
            <div className="flex ml-auto mr-2 w-full">
              {/* follower items */}
              <div className="max-w-[8rem] h-auto w-full mt-4">
                <div className="font-thin text-textLightGrey m-auto">
                  Followed by:
                </div>
                {/* preview of followed by */}
                {!dropdown && (
                  <div className="flex">
                    {followers != null &&
                      followers.slice(0, 4).map((user: User): ReactNode => {
                        return (
                          <img
                            key={user.id}
                            className="h-7 aspect-square object-cover rounded-full"
                            src={
                              user.pfp != null
                                ? user.pfp
                                : "/photos/defaultPfp.png"
                            }
                            alt="photo"
                          />
                        );
                      })}
                    <div className="font-thin text-textLightGrey ml-3">
                      {followers != null && followers.length > 4
                        ? followers.length - 4 + "+"
                        : ""}
                    </div>
                  </div>
                )}
                {/* full followers items */}
                {dropdown &&
                  followers !== null &&
                  followers
                    .slice(0, followers.length)
                    .map((user: User): ReactNode => {
                      return (
                        <div key={user.id} className="flex pb-2">
                          <img
                            className="h-9 aspect-square object-cover rounded-full"
                            src={
                              user.pfp != null
                                ? user.pfp
                                : "/photos/defaultPfp.png"
                            }
                            alt="photo"
                          />
                          <div>
                            <div className="ml-3">@{user.username}</div>
                            <div className="font-thin text-sm text-textLightGrey ml-3">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}
          {/* both follow buttons */}
          <div className="mt-auto mb-7 ml-5">
            {dropdown && !following && (
              // follow button
              <button
                className="flex bg-purple rounded-md justify-center w-[5rem] font-bold text-lg"
                style={{
                  boxShadow: "-3px 5px 0px rgba(142, 12, 181, .5)",
                }}
                onClick={follow}
              >
                Follow
              </button>
            )}
            {dropdown && following && (
              // unfollow button
              <button
                className="flex bg-textLightGrey rounded-md justify-center w-[6rem] font-bold text-lg text-purple"
                style={{
                  boxShadow: "-3px 5px 0px rgba(137, 137, 137, .5)",
                }}
                onClick={unfollow}
              >
                Unfollow
              </button>
            )}
          </div>
        </div>
        {/* drop down button */}
        <div className="text-lg ml-auto min-w-[4rem] mr-6 mt-3">
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
  );
};

export default UserCard;
