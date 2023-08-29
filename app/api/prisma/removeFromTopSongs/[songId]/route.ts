import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/api/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function DELETE(
  req: NextResponse,
  { params }: { params: { songId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    await prisma.topSongsSong.delete({
      where: {
        songId_topSongsId: {
          topSongsId: session?.user.id,
          songId: params.songId,
        },
      },
    });

    return NextResponse.json("Success.", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Failure.", { status: 500 });
  }
}
