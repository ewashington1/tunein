import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faMusic,
  faAnglesUp,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";

const RightSideBar = () => {
  const [dropdown, setDropdown] = useState(false);
  const dropdownBackground = dropdown && "bg-boxDarkGrey rounded-lg";
  return (
    <div className="flex h-screen w-[20vw] justify-around text-white bg-inherit fixed right-0">
      <div className="float-left my-4 mx-2">
        <FontAwesomeIcon className="h-16 align-top" icon={faMusic} />{" "}
      </div>
      <div className={"h-min mr-6 my-4 font-semibold " + dropdownBackground}>
        <div className="p-4">
          My Account{" "}
          {!dropdown ? (
            <button onClick={() => setDropdown(true)}>
              <FontAwesomeIcon icon={faAnglesDown} />
            </button>
          ) : (
            <button onClick={() => setDropdown(false)}>
              <FontAwesomeIcon icon={faAnglesUp} />
            </button>
          )}
        </div>
        {dropdown && (
          <div className="flex flex-col">
            <hr />
            <div className="p-4">Profile</div>
            <hr />
            <div className="p-4">Settings</div>
            <hr />
            <div className="p-4">
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          </div>
        )}
      </div>
      {/* fix dropdown */}
    </div>
  );
};

export default RightSideBar;
