import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { Artist as SpotifyArtist, Album } from "@spotify/web-api-ts-sdk";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

type RateAlbumRequest = NextRequest & {
  req: {
    body: {
      stars: string;
      album: Album;
    };
  };
};

// this route is for rating a new album that hasn't already been
// added to the prisma db
export async function POST(req: RateAlbumRequest) {
  try {
    const body = await req.json();

    //rating stuff
    const stars = body.stars;
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    const albumDetails: Album = body.album;

    //upsert inserts or modifies current if exists
    const albumRating = await prisma.albumRating.upsert({
      where: {
        userId_albumId: { userId: userId, albumId: albumDetails.id },
      },
      update: { stars: stars },
      create: {
        stars: stars,
        user: {
          connect: { id: userId },
        },
        album: {
          connectOrCreate: {
            where: { id: albumDetails.id },
            create: {
              id: albumDetails.id,
              name: albumDetails.name,
              image_url: albumDetails.images[0].url,
              artists: {
                connectOrCreate: albumDetails.artists.map(
                  (artist: SpotifyArtist) => ({
                    where: { id: artist.id },
                    create: {
                      id: artist.id,
                      name: artist.name,
                    },
                  })
                ),
              },
            },
          },
        },
      },
    });

    const returnMsg = "You rated " + albumDetails.id + " " + stars + " stars!";

    return NextResponse.json(
      { msg: returnMsg, newRating: stars },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to rate song." } },
      { status: 500 }
    );
  }
}
