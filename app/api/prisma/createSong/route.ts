import { Artist, SimplifiedArtist, Track } from "@spotify/web-api-ts-sdk";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Song } from "@prisma/client";

type CreateSongRequest = NextRequest & {
  req: { body: { song: Song } };
};

export async function createSong(song: Song) {
  const result = await prisma.song.upsert({
    where: { id: song.id },
    update: {},
    create: {
      id: song.id,
      name: song.name,
      preview_url: song.preview_url,
      image_url:
        song.album === undefined ? song.image_url : song.album.images[0].url,
      artists: {
        connectOrCreate: song.artists.map((artist: SimplifiedArtist) => ({
          where: { id: artist.id },
          create: {
            id: artist.id,
            name: artist.name,
          },
        })),
      },
    },
  });
  return result;
}

export async function POST(req: CreateSongRequest) {
  try {
    const body = await req.json();

    //song stuff
    const songDetails = body;

    const song = await createSong(songDetails);

    return NextResponse.json({ song: song }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to create song." } },
      { status: 500 }
    );
  }
}
