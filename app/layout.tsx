import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthSessionProvider from "./NextAuthSessionProvider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TuneIn",
  description: "Everything Music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("render");
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
