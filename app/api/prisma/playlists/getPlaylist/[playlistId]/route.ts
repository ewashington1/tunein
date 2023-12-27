import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";

// NOT USED ANYWHERE

export async function GET(
  req: NextRequest,
  { params }: { params: { playlistId: string } }
) {
  try {
    const playlistId = params.playlistId;

    //get playlists and send user name with them
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json(playlist, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { errors: { login: "Playlist retreival unsuccessful." } },
      { status: 500 }
    );
  }
}
