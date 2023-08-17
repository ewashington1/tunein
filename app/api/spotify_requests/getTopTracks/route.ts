import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { SpotifyAuthHeaders, getSpotifyAuthHeaders } from "../spotifyAuth";

type GetTopTracksRequest = NextRequest & {
  req: { body: { id: string } };
};

export async function POST(req: GetTopTracksRequest) {
  try {
    const spotifyAuthHeaders: SpotifyAuthHeaders =
      await getSpotifyAuthHeaders();

    const body = await req.json();

    const requestUrl =
      "https://api.spotify.com/v1/artists/" + body.id + "/top-tracks?market=US";

    const topTracksResponse = await axios.get(requestUrl, spotifyAuthHeaders);
    const topTracks = topTracksResponse.data;

    return NextResponse.json(topTracks, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        body: { errors: "Unable to retreive top tracks" },
      },
      { status: 500 }
    );
  }
}
