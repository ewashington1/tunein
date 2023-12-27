import { Artist } from "@spotify/web-api-ts-sdk";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { createArtist } from "@/app/api/prisma/spotifyToDB/createArtist/route";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

type AddToTopArtistsRequest = NextRequest & {
  body: {
    artist: Artist;
  };
};

//catch unique violations and send message: "Already in top artists" (or just success) back to server
export async function POST(req: AddToTopArtistsRequest) {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);

    const artist: Artist = body.artist;

    await createArtist(artist);

    await prisma.topArtistsArtist.create({
      data: {
        artistId: artist.id,
        topArtistsId: session!.user.id,
      },
    });

    return NextResponse.json("Success", { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error", { status: 500 });
  }
}
