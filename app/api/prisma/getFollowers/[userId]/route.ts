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
    const sessionId = session!.user.id;

    const userId = params.userId;

    //finding the followers of the card's user (who session user is following)
    const followers = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            followerId: sessionId,
          },
        },
        following: {
          some: {
            followeeId: userId,
          },
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
      { errors: { login: "Unable to retrieve followers." } },
      { status: 500 }
    );
  }
}
