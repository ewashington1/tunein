import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { getServerSession } from "next-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { songId: string; userId: string } }
) {
  try {
    const songId = params.songId;
    const userId = params.userId;

    const rating = await prisma.songRating.findUnique({
      where: {
        userId_songId: { userId: userId, songId: songId },
      },
    });

    return NextResponse.json(
      { rating: rating !== null ? rating?.stars : 0 },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to retreive rating." } },
      { status: 500 }
    );
  }
}
