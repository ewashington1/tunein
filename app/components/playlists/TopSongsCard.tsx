import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useState,
} from "react";
import { Playlist } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TopSongsWithUsername } from "@/app/types";

const TopSongsCard = ({
  topSongsSelected,
}: {
  topSongsSelected: MutableRefObject<boolean>;
}) => {
  const router = useRouter();
  const visitTopSongs = () => {};
  const visitUser = () => {
    router.push(`/users/${topSongs?.userId}`);
  };

  const [selected, setSelected] = useState<boolean>(topSongsSelected.current);

  return (
    <div className="flex p-2 bg-bgGrey my-1 mx-1 items-center">
      {/* image */}
      <Image
        src={"https://static.thenounproject.com/png/110875-200.png"}
        alt="ico"
        height={48}
        width={48}
        loading="lazy"
        className=" bg-gray-600"
      />
      {/* playlist details */}
      <div className="mx-2">
        <h1
          className="font-semibold text-xl hover:underline cursor-pointer"
          onClick={visitTopSongs}
        >
          My Top Songs
        </h1>
      </div>
      {/* select button */}
      <div className="ml-auto">
        {!selected ? (
          <button
            className="self-center"
            onClick={() => {
              topSongsSelected.current = true;
              setSelected(!selected);
            }}
          >
            <FontAwesomeIcon
              className="align-middle w-8 h-8 p-2 rounded-full border border-white text-purple"
              icon={faPlus}
            />
          </button>
        ) : (
          <button
            className="self-center"
            onClick={() => {
              topSongsSelected.current = false;
              setSelected(!selected);
            }}
          >
            <FontAwesomeIcon
              className="align-middle w-8 h-8 p-2 rounded-full border bg-lightGrey border-white text-purple"
              icon={faCheck}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopSongsCard;
