import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faMusic,
  faAnglesUp,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import Link from "next/link";

const RightSideBar = () => {
  const [dropdown, setDropdown] = useState(false);
  const dropdownBackground = dropdown && "bg-boxDarkGrey rounded-lg";
  return (
    <div className="flex h-screen w-[20vw] justify-around text-white bg-inherit fixed right-0 shadow-sm">
      <div className="float-left my-4 mx-2">
        <FontAwesomeIcon className="h-16 align-top" icon={faMusic} />{" "}
      </div>
      <div className={"h-min mr-6 my-4 font-semibold " + dropdownBackground}>
        {!dropdown ? (
          <button
            className="p-4 outline-none bg-boxDarkGrey rounded-md"
            onClick={() => setDropdown(true)}
          >
            My Account <FontAwesomeIcon icon={faAnglesDown} />
          </button>
        ) : (
          <button
            className="p-4 outline-none"
            onClick={() => setDropdown(false)}
          >
            My Account <FontAwesomeIcon icon={faAnglesUp} />
          </button>
        )}
        {dropdown && (
          <div className="flex flex-col">
            <hr />
            <Link className="p-4" href="/profile">
              Profile
            </Link>
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
