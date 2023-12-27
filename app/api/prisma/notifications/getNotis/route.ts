import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    //get the notifications for the current session user
    const notis = await prisma.notification.findMany({
      where: {
        toUserId: userId,
      },
      select: {
        fromUser: {
          select: {
            id: true,
            username: true,
            pfp: true,
          },
        },
        message: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notis, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to retrive following status." } },
      { status: 500 }
    );
  }
}
