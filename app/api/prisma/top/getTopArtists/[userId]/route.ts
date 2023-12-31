import { prisma } from "@/app/api/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // create user doesnt work that well
    // shouldnt be findMany how to fix?

    // const topArtists = await prisma.topArtists.findMany({
    //   where: {
    //     userId: userId,
    //   },
    //   select: {
    //     artists: {
    //       select: {
    //         artist: true,
    //       },
    //     },
    //   },
    // });

    const topArtists = await prisma.topArtistsArtist.findMany({
      where: {
        TopArtists: {
          userId: userId,
        },
      },
      select: {
        artist: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(topArtists);

    // topArtists.forEach((artists) => {
    //   artists.artists.forEach((artist) => {
    //     console.log(artist);
    //   });
    // });

    return NextResponse.json(topArtists, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error", { status: 500 });
  }
}
