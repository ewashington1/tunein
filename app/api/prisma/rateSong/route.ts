import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Song, SongRating, User } from "@prisma/client";

type SearchUserRequest = NextRequest & {
  req: { body: { searchTerm: string } };
};

export async function POST(req: SearchUserRequest) {
  try {
    const body = await req.json();

    const stars = body.stars;
    const userId = body.userId;
    const songId = body.songId;

    const song: Song = await prisma.song.create({
      data: {
        id: songId,
      },
    });

    //get users with matching username to search
    const songRating: SongRating = await prisma.songRating.create({
      data: {
        songId: songId,
        stars: stars,
        userId: userId,
      },
    });
    console.log(songRating);
    const returnMsg =
      "You rated " + songRating.songId + " " + stars + " stars!";

    return NextResponse.json(
      { msg: returnMsg, newRating: stars },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { errors: { login: "Unable to rate song." } },
      { status: 500 }
    );
  }
}
