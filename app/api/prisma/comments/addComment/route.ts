import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);

    const songId = body.songId;
    const comment = body.comment;

    const commentWithSong = await prisma.comment.create({
      data: {
        songId: songId,
        comment: comment,
        userId: session?.user.id,
      },
      select: {
        song: {
          select: {
            name: true,
          },
        },
      },
    });

    const commentWithUsername = await prisma.comment.findUnique({
      where: {
        songId_userId: { songId: songId, userId: session?.user.id },
      },
      include: {
        user: { select: { username: true } },
      },
    });

    //notification portion
    const fromUser = session?.user.id;
    const message = "commented on " + commentWithSong.song.name;

    //finding everyone who follows the commenter and rated this song
    const toUsers = await prisma.songRating.findMany({
      where: {
        songId: songId,
        user: {
          following: {
            some: {
              followeeId: fromUser,
            },
          },
        },
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

    return NextResponse.json(commentWithUsername, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Failure", { status: 500 });
  }
}
