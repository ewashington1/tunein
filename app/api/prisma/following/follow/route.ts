import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function POST(req: NextRequest & { followeeId: string }) {
  try {
    const session = await getServerSession(authOptions);
    const followerId = session!.user.id;
    const body = await req.json();
    const followeeId = body.followeeId;

    //creating a new follow relation between the two users
    await prisma.follow.create({
      data: {
        follower: { connect: { id: followerId } },
        followee: { connect: { id: followeeId } },
      },
    });

    // notification portion
    const fromUser: string = session!.user.id;

    const toUser: string = body.followeeId;
    const message: string = "followed you";

    //creating a new notification relation between two users
    await prisma.notification.create({
      data: {
        fromUser: { connect: { id: fromUser } },
        toUser: { connect: { id: toUser } },
        message: message,
      },
    });

    return NextResponse.json(
      { message: "Follow successful." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { errors: { login: "Follow unsuccessful." } },
      { status: 500 }
    );
  }
}
