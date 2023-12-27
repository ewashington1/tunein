import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { Song, SongRating, User } from "@prisma/client";
import { Artist, Track } from "@spotify/web-api-ts-sdk";
import { createSong } from "@/app/api/prisma/spotifyToDB/createSong/route";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
    const session = await getServerSession(authOptions);
    const sessionId = session!.user!.id;

    //song stuff
    const song = body.song;

    //creates song in db
    await createSong(song);

    //get users with matching username to search
    const songRating = await prisma.songRating.upsert({
      where: { userId_songId: { userId: sessionId, songId: song.id } },
      update: { stars: stars },
      create: {
        stars: stars,
        user: {
          connect: { id: sessionId },
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
