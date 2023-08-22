import React from "react";
import { Playlist } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SidebarPlaylistCardProps = {
  playlist: Playlist;
};

const SidebarPlaylistCard = ({ playlist }: SidebarPlaylistCardProps) => {
  const router = useRouter();
  const visitUser = () => {
    router.push(`/users/${playlist.userId}`);
  };
  const visitPlaylist = () => {
    router.push(`/playlists/${playlist.id}`);
  };
  return (
    <div className="flex p-2 bg-bgGrey my-1 mx-1 items-center">
      {/* image */}
      <Image
        src={
          playlist.image !== null
            ? playlist.image
            : "/photos/defaultPlaylistImage.png"
        }
        alt="ico"
        height={48}
        width={48}
        loading="lazy"
      />
      {/* playlist details */}
      <div className="mx-2">
        <h1
          className="font-semibold text-xl hover:underline cursor-pointer"
          onClick={visitPlaylist}
        >
          {playlist.name}
        </h1>
        {/* playlist - {owner} */}
        <div className="flex items-center text-sm text-textLightGrey font-extralight">
          <h2 className="">Playlist</h2>
          <div className="bg-textLightGrey w-1 h-1 rounded-full mx-2"></div>
          <h2 className=" hover:underline cursor-pointer" onClick={visitUser}>
            {playlist.user.name}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SidebarPlaylistCard;
