import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(
  req: NextRequest,
  { params }: { params: { albumId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;
    const albumId = params.albumId;

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
