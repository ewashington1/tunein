import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(
  req: NextRequest,
  { params }: { params: { artistId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;
    const artistId = params.artistId;

    const rating = await prisma.artistRating.findUnique({
      where: {
        userId_artistId: { userId: userId, artistId: artistId },
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
