import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { Album } from "@spotify/web-api-ts-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createAlbum } from "../createAlbum";

type AddToTopAlbumsRequest = NextRequest & {
  req: { body: { album: Album } };
};

export async function POST(req: AddToTopAlbumsRequest) {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);

    const album: Album = body.album;

    console.log(album);

    await createAlbum(album);

    await prisma.topAlbumsAlbum.create({
      data: {
        albumId: album.id,
        topAlbumsId: session!.user.id,
      },
    });
    return NextResponse.json("Successfully added!", { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to add to top albums." } },
      { status: 500 }
    );
  }
}
