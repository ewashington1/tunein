import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const followerId = session!.user.id;

    const followeeId = params.userId;

    //get if session user is following card's user
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId: followerId,
          followeeId: followeeId,
        },
      },
    });

    const found = follow !== null;

    return NextResponse.json(found, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to retrive following status." } },
      { status: 500 }
    );
  }
}
