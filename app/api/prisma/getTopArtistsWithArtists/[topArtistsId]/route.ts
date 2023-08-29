import { prisma } from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { topArtistsId: string } }
) {
  try {
    const topArtistsId = params.topArtistsId;

    const topArtistsWithArtists = await prisma.topArtists.findUnique({
      where: { id: topArtistsId },
      include: {
        artists: { include: { artist: true } },
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(topArtistsWithArtists, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error", { status: 500 });
  }
}
