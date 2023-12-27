import { prisma } from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { songId: string } }
) {
  try {
    const songId = params.songId;

    const comments = await prisma.song.findUnique({
      where: { id: songId },
      select: {
        comments: { include: { user: { select: { username: true } } } },
      },
    });

    return NextResponse.json(comments?.comments, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Failure", { status: 500 });
  }
}
