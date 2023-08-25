import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

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
      { errors: { login: "Playlist retreival unsuccessful." } },
      { status: 500 }
    );
  }
}
