"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";

import React from "react";

type AuthenticatedLayoutProps = {
  children?: React.ReactNode;
};

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  //renaming data to session
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center">
        <LeftSideBar />
        <div className="text-white self-center font-bold text-4xl">
          Loading...
        </div>
        <RightSideBar />
      </div>
    );
  } else if (!session) {
    //replaces current browser url in stack by default
    redirect("/login");
  }

  return (
    <div className="flex justify-center">
      <LeftSideBar />
      {children}
      <RightSideBar />
    </div>
  );
};

export default AuthenticatedLayout;
