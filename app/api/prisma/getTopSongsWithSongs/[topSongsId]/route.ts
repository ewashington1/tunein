import { prisma } from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { topSongsId: string } }
) {
  try {
    const topSongsId = params.topSongsId;

    const topSongsWithSongs = await prisma.topSongs.findUnique({
      where: { id: topSongsId },
      include: {
        songs: { include: { song: true } },
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(topSongsWithSongs, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error", { status: 500 });
  }
}
