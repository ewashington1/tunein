import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Track } from "@spotify/web-api-ts-sdk";
import { createSong } from "../createSong/route";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

type AddToTopSongsRequest = NextRequest & {
  req: { body: { song: Track } };
};

export async function POST(req: AddToTopSongsRequest) {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);

    const song: Track = body.song;

    console.log(song.id);
    console.log(session?.user.id);

    await createSong(song);

    await prisma.topSongsSong.create({
      data: {
        songId: song.id,
        topSongsId: session!.user.id,
      },
    });
    return NextResponse.json("Successfully added!", { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to add to top songs." } },
      { status: 500 }
    );
  }
}
