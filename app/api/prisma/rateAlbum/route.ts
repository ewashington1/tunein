import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Song, SongRating, User } from "@prisma/client";
import { Artist, Album } from "@spotify/web-api-ts-sdk";

type RateAlbumRequest = NextRequest & {
  req: {
    body: {
      stars: string;
      userId: string;
      album: Album;
    };
  };
};

export async function POST(req: RateAlbumRequest) {
  try {
    const body = await req.json();

    //rating stuff
    const stars = body.stars;
    const userId = body.userId;

    //song stuff
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
                connectOrCreate: albumDetails.artists.map((artist: Artist) => ({
                  where: { id: artist.id },
                  create: {
                    id: artist.id,
                    name: artist.name,
                  },
                })),
              },
            },
          },
        },
      },
    });

    const returnMsg =
      "You rated " + albumRating.albumId + " " + stars + " stars!";

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
