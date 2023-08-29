import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/api/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function DELETE(
  req: NextResponse,
  { params }: { params: { artistId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    await prisma.topArtistsArtist.delete({
      where: {
        artistId_topArtistsId: {
          topArtistsId: session?.user.id,
          artistId: params.artistId,
        },
      },
    });

    return NextResponse.json("Success.", { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Failure.", { status: 500 });
  }
}
