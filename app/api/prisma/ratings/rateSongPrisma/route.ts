import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
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

// this route is for rating a new song that hasn't already been
// added to the prisma db
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

    //notification portion
    const fromUser: string = session!.user.id;
    const message: string = "rated " + song.name;
    //finding every user that follows the rater and rated this song
    const toUsers = await prisma.songRating.findMany({
      where: {
        user: {
          following: {
            some: {
              followeeId: fromUser,
            },
          },
        },
        songId: song.id,
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
