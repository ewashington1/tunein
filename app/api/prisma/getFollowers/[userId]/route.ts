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

    //creating a new follow relation between the two users
    const followers = await prisma.user.findMany({
      where: {
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
      { errors: { login: "Follow unsuccessful." } },
      { status: 500 }
    );
  }
}
