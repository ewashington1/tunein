import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);

    const songId = body.songId;
    const comment = body.comment;

    await prisma.comment.create({
      data: {
        songId: songId,
        comment: comment,
        userId: session?.user.id,
      },
    });

    const commentWithUsername = await prisma.comment.findUnique({
      where: {
        songId_userId: { songId: songId, userId: session?.user.id },
      },
      include: {
        user: { select: { username: true } },
      },
    });

    return NextResponse.json(commentWithUsername, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Failure", { status: 500 });
  }
}
