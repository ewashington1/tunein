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

    //deleting a follow relation between the two users
    const unfollow = await prisma.follow.delete({
      where: {
        followerId_followeeId: {
          followerId: followerId,
          followeeId: followeeId,
        },
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
