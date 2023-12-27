import React, { ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faMusic,
  faAnglesUp,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Notification } from "@prisma/client";
import { usePathname } from "next/navigation";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

const RightSideBar = () => {
  const [dropdown, setDropdown] = useState(false);
  const [notiDropdown, setNotiDropdown] = useState(false);
  const [notifications, setNotifications] = useState<
    NotificationWithUser[] | null
  >(null);

  const dropdownBackground = dropdown && "bg-boxDarkGrey rounded-lg";

  const pathname = usePathname();
  const paths = {
    profile: pathname === "/profile" ? "text-purple" : "text-white",
    settings: pathname === "/settings" ? "text-purple" : "text-white",
    account:
      pathname === "/profile" || pathname === "/settings"
        ? "text-purple"
        : "text-white",
  };
  const noti = { color: notiDropdown ? "text-purple" : "text-white" };

  type NotificationWithUser = Notification & {
    fromUser: { id: string; username: string; pfp: string };
  };

  const getNotis = async () => {
    axios
      .get("/api/prisma/notifications/getNotis")
      .then((res) => {
        console.log(res.data);
        setNotifications(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex h-screen min-w-[20vw] justify-around text-white bg-inherit fixed right-0 w-auto">
      <div className="float-left my-4 mx-2 relative ">
        <button
          onClick={() => {
            setNotiDropdown(!notiDropdown);
            if (notiDropdown != true) {
              getNotis();
            }
          }}
        >
          <FontAwesomeIcon
            className={"h-16 align-top " + noti.color}
            icon={faMusic}
          />
        </button>
        {notiDropdown && (
          <div className="flex items-center ml-3">
            <div className="w-0 h-0 border-l-[26px] border-l-transparent border-b-[32px] border-r-[26px] border-r-transparent border-boxDarkGrey" />
            <div className="bg-boxDarkGrey absolute right-0 top-24 p-3 w-[35rem] h-[30rem]">
              {/* will be a loop */}
              {notifications?.map(
                (
                  notification: NotificationWithUser,
                  index: number
                ): ReactNode => {
                  return (
                    <div key={index}>
                      <div className="flex items-center p-3">
                        <img
                          className="h-10 aspect-square mr-2 object-cover rounded-full"
                          src={
                            notification.fromUser.pfp != null
                              ? notification.fromUser.pfp
                              : "/photos/defaultPfp.png"
                          }
                          alt="photo"
                        />
                        <div className="font-bold mr-1 ">
                          @{notification.fromUser.username}
                        </div>
                        <div className="font-thin text-textLightGrey mr-2 whitespace-nowrap truncate">
                          {notification.message}
                        </div>
                        <div className="bg-textLightGrey w-1 h-1 rounded-full min-w-[.25rem] mr-2" />
                        <div className="text-textLightGrey whitespace-nowrap">
                          {timeAgo.format(new Date(notification.createdAt))}
                        </div>
                      </div>
                      {index !== notifications.length - 1 && <hr />}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
      <div className={"h-min mr-6 my-4 font-semibold " + dropdownBackground}>
        {!dropdown ? (
          <button
            className={
              "p-4 outline-none bg-boxDarkGrey rounded-md " + paths.account
            }
            onClick={() => setDropdown(true)}
          >
            My Account{" "}
            <FontAwesomeIcon className="text-white" icon={faAnglesDown} />
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
            <Link className={"p-4 " + paths.profile} href="/profile">
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
