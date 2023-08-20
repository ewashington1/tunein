import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../prisma";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string; userId: string } }
) {
  try {
    const sessionId = params.sessionId;
    const userId = params.userID;

    //creating a new follow relation between the two users
    const followers = await prisma.user.findMany({
      where: {
        followee: {
          contains: userId,
        },
        NOT: {
          id: sessionId,
        },
      },
    });

    return NextResponse.json(followers, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Follow unsuccessful." } },
      { status: 500 }
    );
  }
}
