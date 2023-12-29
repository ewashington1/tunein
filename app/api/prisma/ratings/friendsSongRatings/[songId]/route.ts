import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: NextRequest,
  { params }: { params: { songId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;
    const songId = params.songId;

    // get friend's song ratings
    const ratings = await prisma.songRating.findMany({
      where: {
        AND: [
          {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
          { songId: songId },
        ],
      },
      include: {
        user: {
          select: {
            username: true,
            id: true,
            pfp: true,
          },
        },
      },
    });

    return NextResponse.json({ ratings: ratings }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { ratingRetreival: "Unable to retreive ratings." } },
      { status: 500 }
    );
  }
}
