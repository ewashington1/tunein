import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { SpotifyAuthHeaders, getSpotifyAuthHeaders } from "../spotifyAuth";

type GetSongRequest = NextRequest & { req: { body: { id: string } } };

export async function POST(req: GetSongRequest) {
  try {
    const spotifyAuthHeaders: SpotifyAuthHeaders =
      await getSpotifyAuthHeaders();

    const body = await req.json();

    const testSong = await axios.get(
      "https://api.spotify.com/v1/tracks/" + body.id,
      spotifyAuthHeaders
    );

    const songBody = testSong.data;
    console.log(songBody);

    return NextResponse.json({ body: songBody }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        body: { errors: "Unable to retreive test song" },
      },
      { status: 500 }
    );
  }
}
