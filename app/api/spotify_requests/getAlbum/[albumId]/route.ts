import { NextRequest, NextResponse } from "next/server";
import {
  SpotifyAuthHeaders,
  getSpotifyAuthHeaders,
} from "@/app/api/spotify_requests/spotifyAuth";
import axios from "axios";
import { Album } from "@spotify/web-api-ts-sdk";

export async function GET(
  req: NextRequest,
  { params }: { params: { albumId: string } }
) {
  try {
    const albumId = params.albumId;
    const spotifyAuthHeaders: SpotifyAuthHeaders =
      await getSpotifyAuthHeaders();

    const albumResponse = await axios.get(
      "https://api.spotify.com/v1/albums/" + albumId,
      spotifyAuthHeaders
    );

    const albumDetails: Album = albumResponse.data;

    return NextResponse.json({ albumDetails: albumDetails }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        body: { errors: "Unable to retreive  album" },
      },
      { status: 500 }
    );
  }
}
