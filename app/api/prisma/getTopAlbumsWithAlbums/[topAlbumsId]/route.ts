import { prisma } from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { topAlbumsId: string } }
) {
  try {
    const topAlbumsId = params.topAlbumsId;

    const topAlbumsWithAlbums = await prisma.topAlbums.findUnique({
      where: { id: topAlbumsId },
      include: {
        albums: { include: { album: true } },
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(topAlbumsWithAlbums, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error", { status: 500 });
  }
}
