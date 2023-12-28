import { NextRequest, NextResponse } from "next/server";
import {
  SpotifyAuthHeaders,
  getSpotifyAuthHeaders,
} from "@/app/api/spotify_requests/spotifyAuth";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: { songId: string } }
) {
  try {
    const songId = params.songId;
    const spotifyAuthHeaders: SpotifyAuthHeaders =
      await getSpotifyAuthHeaders();

    const songResponse = await axios.get(
      "https://api.spotify.com/v1/tracks/" + songId,
      spotifyAuthHeaders
    );

    const songDetails = songResponse.data;

    return NextResponse.json({ songDetails: songDetails }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        body: { errors: "Unable to retreive  song" },
      },
      { status: 500 }
    );
  }
}
