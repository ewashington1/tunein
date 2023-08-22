import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Song, SongRating, User } from "@prisma/client";
import { Artist, Track } from "@spotify/web-api-ts-sdk";
import { createSong } from "../createSong/route";

type RateSongRequest = NextRequest & {
  req: {
    body: {
      stars: string;
      userId: string;
      song: Track;
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
    const song = body.song;

    await createSong(song);

    //get users with matching username to search
    const songRating = await prisma.songRating.upsert({
      where: { userId_songId: { userId: userId, songId: song.id } },
      update: { stars: stars },
      create: {
        stars: stars,
        user: {
          connect: { id: userId },
        },
        song: {
          connect: { id: song.id },
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
