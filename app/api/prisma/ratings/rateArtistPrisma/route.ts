import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { Artist } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

type RateArtistRequest = NextRequest & {
  req: {
    body: {
      stars: string;
      artist: Artist;
    };
  };
};

export async function POST(req: RateArtistRequest) {
  try {
    const body = await req.json();

    //rating stuff
    const stars = body.stars;
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    const artistDetails: Artist = body.artist;

    //upsert inserts or modifies current if exists
    await prisma.artistRating.upsert({
      where: {
        userId_artistId: { userId: userId, artistId: artistDetails.id },
      },
      update: { stars: stars },
      create: {
        stars: stars,
        user: {
          connect: { id: userId },
        },
        artist: {
          connect: {
            id: artistDetails.id,
          },
        },
      },
    });

    //notification portion
    const fromUser: string = session!.user.id;
    const message: string = "rated " + artistDetails.name;

    //finding every user that follows the rater and rated this artist
    const toUsers = await prisma.artistRating.findMany({
      where: {
        user: {
          following: {
            some: {
              followeeId: fromUser,
            },
          },
        },
        artistId: artistDetails.id,
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    const notifications = toUsers.map((toUser) => ({
      fromUserId: fromUser,
      toUserId: toUser.user.id,
      message: message,
    }));

    //creating a new notification relation between two users
    await prisma.notification.createMany({
      data: notifications,
    });

    const returnMsg = "You rated " + artistDetails.id + " " + stars + " stars!";

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
