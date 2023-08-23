import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Playlist } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    body.playlistIds.forEach(async (playlistId: string) => {
      await prisma.playlistSong.delete({
        where: {
          playlistId_songId: {
            playlistId: playlistId,
            songId: body.songId,
          },
        },
      });
    });

    return NextResponse.json("Success!", { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to remove from playlists." } },
      { status: 500 }
    );
  }
}
