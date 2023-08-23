import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Album, Song, SongRating, User } from "@prisma/client";
import { Artist } from "@spotify/web-api-ts-sdk";

type RateAlbumRequest = NextRequest & {
  req: {
    body: {
      stars: string;
      userId: string;
      albumId: string;
      name: string;
      artists: Artist[];
      image_url: string;
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
    const albumDetails = body;

    //upsert inserts or modifies current if exists
    const albumRating = await prisma.albumRating.upsert({
      where: {
        userId_albumId: { userId: userId, albumId: albumDetails.albumId },
      },
      update: { stars: stars },
      create: {
        stars: stars,
        user: {
          connect: { id: userId },
        },
        album: {
          connectOrCreate: {
            where: { id: albumDetails.albumId },
            create: {
              id: albumDetails.albumId,
              name: albumDetails.name,
              image_url: albumDetails.image_url,
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
