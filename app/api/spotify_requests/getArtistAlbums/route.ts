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
      "https://api.spotify.com/v1/artists/" +
      body.id +
      "/albums?include_groups=album&market=US&limit=10";

    const albumsResponse = await axios.get(requestUrl, spotifyAuthHeaders);
    const albums = albumsResponse.data;

    return NextResponse.json(albums, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        body: { errors: "Unable to retreive top albums" },
      },
      { status: 500 }
    );
  }
}
