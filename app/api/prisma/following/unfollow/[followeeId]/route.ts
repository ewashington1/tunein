import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { followeeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const followerId = session!.user.id;

    const followeeId = params.followeeId;

    //deleting a follow relation between the two users
    await prisma.follow.delete({
      where: {
        followerId_followeeId: {
          followerId: followerId,
          followeeId: followeeId,
        },
      },
    });

    //notification portion
    const outNotidId: string = session!.user.id;
    const inNotiId: string = params.followeeId;

    //deleting the notification relation between two users
    await prisma.notification.deleteMany({
      where: {
        fromUserId: outNotidId,
        toUserId: inNotiId,
        message: "followed you",
      },
    });

    return NextResponse.json(
      { message: "Unfollow successful." },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unfollow not successful." } },
      { status: 500 }
    );
  }
}
