import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Album } from "@prisma/client";
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

export async function POST(req: RateAlbumRequest) {
  try {
    const body = await req.json();

    //only send albumId and stars from frontend

    //rating stuff
    const stars = body.stars;
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    const albumDetails: Album = body.album;

    //upsert inserts or modifies current if exists
    await prisma.albumRating.upsert({
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
          connect: {
            id: albumDetails.id,
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
