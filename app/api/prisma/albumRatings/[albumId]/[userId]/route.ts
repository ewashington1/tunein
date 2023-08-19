import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { albumId: string; userId: string } }
) {
  try {
    const albumId = params.albumId;
    const userId = params.userId;

    const rating = await prisma.albumRating.findUnique({
      where: {
        userId_albumId: { userId: userId, albumId: albumId },
      },
    });

    return NextResponse.json({ rating: rating?.stars }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to retreive rating." } },
      { status: 500 }
    );
  }
}
