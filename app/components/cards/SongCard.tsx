import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import NewStarRatingSongSpotify from "../MyStarRatingSongSpotify";
import AddToPlaylistModal from "../playlists/AddToPlaylistModal";
import { createPortal } from "react-dom";

type SongCardProps = {
  className?: string;
  track: Track;
};

const SongCard = ({ className, track }: SongCardProps) => {
  const isPlayable = track.preview_url !== null || undefined;

  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] =
    useState<boolean>(false);

  //useRef will persist the audioRef object accross renders, so the pause will work
  //plays goofy goober song if not playable
  const audioRef = useRef<HTMLAudioElement>(
    isPlayable
      ? new Audio(track.preview_url!)
      : new Audio(
          "https://p.scdn.co/mp3-preview/aae48394efdf138b03cd…987c5f968a07?cid=53046699179e40438288c487c19afec5"
        )
  );
  //initializes it to if the audio is playing (prevents if you're playing the song and you try to play it again)
  const [songPlaying, setSongPlaying] = useState<boolean>(false);

  return (
    // height was 12.5 at first, change back after done messing w preview
    <div className="bg-boxLightGrey mx-auto mb-4 w-4/5 h-auto">
      <div className="w-full h-full flex p-2 max-h-[10.5vh]">
        <img src={track.album.images[0].url} alt="" className="h-full mr-2" />
        {/* song info */}
        <div className="flex flex-col justify-center max-w-[50%] overflow-x-hidden">
          <div className="font-bold text-xl whitespace-nowrap">
            {track.name}
          </div>
          <div className="font-light text-sm text-textLightGrey align-middle flex">
            <div className="inline">Song</div>
            <div className="w-1 h-1 bg-textLightGrey rounded-full inline-block mx-1 my-auto"></div>
            <div className="inline whitespace-nowrap">
              {/* make each link to artist */}
              {track.artists.map((artist) => artist.name).join(", ")}
            </div>
          </div>
        </div>
        {/* right side */}
        <div className="flex ml-auto mr-2">
          {/* song preview button */}
          {isPlayable && (
            <div className="self-center pr-2">
              {songPlaying ? (
                <button
                  onClick={() => {
                    setSongPlaying(false);
                    audioRef.current.pause();
                  }}
                  className="self-center"
                >
                  <FontAwesomeIcon
                    className="align-middle w-8 h-8 p-2 rounded-full border border-white text-purple"
                    icon={faPause}
                  />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSongPlaying(true);
                    audioRef.current.play();
                  }}
                  className="self-center"
                >
                  <FontAwesomeIcon
                    className="align-middle w-8 h-8 p-2 rounded-full border border-white text-purple"
                    icon={faPlay}
                  />
                </button>
              )}
            </div>
          )}
          {/* add to playlist button */}
          <button
            className="self-center"
            onClick={() => setAddToPlaylistModalOpen(true)}
          >
            <FontAwesomeIcon
              className="align-middle w-8 h-8 p-2 rounded-full border border-white text-purple"
              icon={faPlus}
            />
          </button>
          {addToPlaylistModalOpen &&
            createPortal(
              <AddToPlaylistModal
                setAddToPlaylistModalOpen={setAddToPlaylistModalOpen}
                song={track}
              />,
              document.body
            )}
          {/* vertical divider between two */}
          <div className="h-4/5 w-[1px] bg-white self-center mx-4"></div>
          {/* my rating */}
          <div className="flex flex-col self-center text-lg items-center">
            <div>My rating:</div>
            <NewStarRatingSongSpotify song={track} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
