import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    //get playlists and send user name with them
    const playlists = await prisma.playlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(playlists, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { errors: { login: "Follow unsuccessful." } },
      { status: 500 }
    );
  }
}
