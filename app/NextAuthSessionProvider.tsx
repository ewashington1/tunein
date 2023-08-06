"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface NextAuthSessionProviderProps {
  children: React.ReactNode;
}

const NextAuthSessionProvider = ({
  children,
}: NextAuthSessionProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthSessionProvider;
