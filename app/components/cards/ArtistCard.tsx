import React, { ReactNode, useEffect, useState } from "react";
import { Album, Artist, Track } from "@spotify/web-api-ts-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPlus,
  faStar as unfilledStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { createPortal } from "react-dom";
import AddToTopArtistsModal from "./AddToTopArtistsModal";
import Image from "next/image";
import MyStarRatingArtistSpotify from "../myRatings/MyStarRatingArtistSpotify";

type ArtistCardProps = {
  className?: string;
  artist: Artist;
};

const ArtistCard = ({ className, artist }: ArtistCardProps) => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [topTracks, setTopTracks] = useState<Track[] | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [addToTopArtistsOpen, setAddToTopArtistsOpen] =
    useState<boolean>(false);

  const getTopTracks = async () => {
    if (topTracks !== null) return;
    axios
      .post("/api/spotify_requests/getTopTracks", { id: artist.id })
      .then((res) => {
        setTopTracks(res.data.tracks);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAlbums = async () => {
    if (albums !== null) return;
    axios
      .post("/api/spotify_requests/getArtistAlbums", { id: artist.id })
      .then((res) => {
        setAlbums(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const expandDropdown = async () => {
    await getTopTracks();
    await getAlbums();
    setDropdown(true);
  };

  //for the next button on top tracks (should do for album too)
  const [topTrackIndex, setTopTrackIndex] = useState<number>(0);
  const nextTopTracks = () => {
    setTopTrackIndex(() => topTrackIndex + 1);
  };

  return (
    <div className={"bg-boxLightGrey mx-auto mb-4 w-4/5 h-auto "}>
      {/* info at top -- picture, name, etc */}
      <div className="w-full h-full max-h-[11.5vh] flex p-3">
        {/* Artist image */}
        <img
          className="h-full aspect-square mr-2 object-cover rounded-full"
          src={
            artist.images[0] != null
              ? artist.images[0].url
              : "/photos/defaultPfp.png"
          }
          alt="photo"
        />

        {/* artist info */}
        <div className="flex flex-col justify-center">
          <div className="font-bold text-xl">{artist.name}</div>
          <div className="font-light text-sm text-textLightGrey align-middle flex">
            <div className="inline">Artist</div>
          </div>
        </div>
        <div className="flex ml-auto mr-2">
          {/* my rating */}
          <div className="flex flex-col self-center text-lg items-center">
            <div>My rating:</div>
            <MyStarRatingArtistSpotify artist={artist} />
          </div>
          {/* add to favorite artists button */}
          <button
            className="self-center ml-3"
            onClick={() => setAddToTopArtistsOpen(true)}
          >
            <FontAwesomeIcon
              className="align-middle w-8 h-8 p-2 rounded-full border border-white text-purple"
              icon={faPlus}
            />
          </button>
          {/* vertical divider between two */}
          <div className="h-4/5 w-[1px] bg-white self-center mx-4"></div>
          {/* my rating */}
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
      {/* dropdown content */}
      {dropdown && (
        <div className="p-3 dropdownTransition">
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
                        {/* <Image src={track.album.images[0].url} alt="photo" /> */}
                        <div>{track.name}</div>
                      </div>
                    );
                  })
                )
              ) : (
                <div className="flex justify-start">
                  <div>Loading...</div>
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
                  <div>Loading...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {addToTopArtistsOpen &&
        createPortal(
          <AddToTopArtistsModal
            artist={artist}
            setAddToTopArtistsOpen={setAddToTopArtistsOpen}
          />,
          document.body
        )}
    </div>
  );
};

export default ArtistCard;
