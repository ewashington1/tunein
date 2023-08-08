import React, { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark as filledX } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark as unfilledX } from "@fortawesome/free-regular-svg-icons";

type SearchPageProps = {
  setSearchPanel: Dispatch<SetStateAction<boolean>>;
  className?: string;
};

const SearchPage = ({ setSearchPanel, className }: SearchPageProps) => {
  //fix the formatting of this whole panel
  return (
    <div className={"h-screen w-[60vw] bg-boxDarkGrey " + className}>
      <div className="bg-white absolute h-3/5 w-[1px] mt-[20vh]"></div>
      <button onClick={() => setSearchPanel(false)} className="float-right m-4">
        <FontAwesomeIcon className="text-white h-8" icon={unfilledX} />
      </button>
      <div className="flex justify-center mt-8 font-semibold text-2xl">
        <div className="px-4 border-r">
          <button>Songs</button>
        </div>
        <div className="px-4 border-r">
          <button>Albums</button>
        </div>
        <div className="px-4">
          <button>Artists</button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
