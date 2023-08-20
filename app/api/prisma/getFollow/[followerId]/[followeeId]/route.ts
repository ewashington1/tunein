import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma";
import { User } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { followerId: string; followeeId: string } }
) {
  try {
    const followerId = params.followerId;
    const followeeId = params.followeeId;

    //get if user is following other user
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
      { errors: { login: "Unable to retreive users." } },
      { status: 500 }
    );
  }
}
