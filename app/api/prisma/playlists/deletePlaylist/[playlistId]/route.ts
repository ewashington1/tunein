import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/api/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { playlistId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const playlistId = params.playlistId;

    await prisma.playlist.delete({
      where: { id: playlistId, userId: session!.user!.id },
    });

    return NextResponse.json({ message: "Playlist deleted!" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: "Playlist couldn't be deleted." },
      { status: 500 }
    );
  }
}
