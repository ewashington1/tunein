import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Song, SongRating, User } from "@prisma/client";
import { Artist } from "@spotify/web-api-ts-sdk";

type RateSongRequest = NextRequest & {
  req: {
    body: {
      stars: string;
      userId: string;
      songId: string;
      name: string;
      artists: Artist[];
      preview_url: string;
      image_url: string;
    };
  };
};

export async function POST(req: RateSongRequest) {
  try {
    const body = await req.json();

    //rating stuff
    const stars = body.stars;
    const userId = body.userId;

    //song stuff
    const songDetails = body;

    //get users with matching username to search
    const songRating = await prisma.songRating.create({
      data: {
        stars: stars,
        user: {
          connect: { id: userId },
        },
        song: {
          connectOrCreate: {
            where: { id: songDetails.songId },
            create: {
              id: songDetails.songId,
              name: songDetails.name,
              preview_url: songDetails.preview_url,
              image_url: songDetails.image_url,
              artists: {
                connectOrCreate: songDetails.artists.map((artist: Artist) => ({
                  where: { id: artist.id },
                  create: {
                    id: artist.id,
                  },
                })),
              },
            },
          },
        },
      },
    });

    const returnMsg =
      "You rated " + songRating.songId + " " + stars + " stars!";

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
