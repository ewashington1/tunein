import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Song } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

type RateSongRequest = NextRequest & {
  req: {
    body: {
      stars: string;
      song: Song;
    };
  };
};

export async function PUT(req: RateSongRequest) {
  try {
    const body = await req.json();

    //rating stuff
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;
    const stars = body.stars;

    //song stuff
    const song = body.song;

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
