import { Artist } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

type TopArtistsArtistCardProps = {
  topArtistsArtist: { artist: Artist; topArtistsId: string; artistId: string };
  editMode: boolean;
  removeFromTopArtists: (artistId: string) => Promise<void>;
};

const TopArtistsArtistCard = ({
  topArtistsArtist,
  editMode,
  removeFromTopArtists,
}: TopArtistsArtistCardProps) => {
  const [imageUrl, setImageUrl] = useState<string>("/photos/defaultPfp.png");

  useEffect(() => {
    axios
      .get("/api/spotify_requests/getArtistImage/" + topArtistsArtist.artistId)
      .then((res) => {
        setImageUrl(res.data);
      })
      .catch((err) => {
        console.log("No artist image");
      });
  }, []);

  return (
    <div className="flex items-center gap-2 w-full h-auto bg-boxLightGrey p-2 my-2">
      {/* image */}
      <Image
        src={imageUrl}
        className="rounded-full"
        alt="cover"
        height={75}
        width={75}
      />
      {/* song details */}
      <div className="flex flex-col justify-center">
        <div className="font-bold text-2xl">{topArtistsArtist.artist.name}</div>
        <div className="flex items-center gap-1 font-extralight text-md text-textLightGrey">
          <div>Artist</div>
          <div className="w-1 h-1 bg-textLightGrey rounded-full"></div>
          <div>{topArtistsArtist.artist.name}</div>
        </div>
      </div>
      <div className="ml-auto">
        {editMode && (
          <button
            onClick={() => removeFromTopArtists(topArtistsArtist.artistId)}
            className="flex items-center rounded-full h-12 w-12 border border-white"
          >
            <FontAwesomeIcon
              className="m-auto text-2xl h-10 w-10"
              icon={faMinus}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopArtistsArtistCard;
