import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Track } from "@spotify/web-api-ts-sdk";
import axios from "axios";
import { createSong } from "../createSong/route";

type AddToPlaylistRequest = NextRequest & {
  req: { body: { playlistIds: string[]; song: Track } };
};

export async function POST(req: AddToPlaylistRequest) {
  try {
    const body = await req.json();

    const playlists = body.playlists;
    const song = body.song;

    await createSong(song);

    const result = await playlists.forEach(async (playlistId: string) => {
      const psid = await prisma.playlistSong.create({
        data: { playlistId: playlistId, songId: song.id },
      });
    });

    return NextResponse.json("Successfully added!", { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to add to playlists." } },
      { status: 500 }
    );
  }
}
