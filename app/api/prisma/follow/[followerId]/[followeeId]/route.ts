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

    //creating a new follow relation between the two users
    const follow = await prisma.follow.create({
      data: {
        follower: { connect: { id: followerId } },
        followee: { connect: { id: followeeId } },
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
