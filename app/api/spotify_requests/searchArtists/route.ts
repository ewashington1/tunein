import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { SpotifyAuthHeaders, getSpotifyAuthHeaders } from "../spotifyAuth";

type SearchSongRequest = NextRequest & {
  req: { body: { searchTerm: string } };
};

export async function POST(req: SearchSongRequest) {
  try {
    const spotifyAuthHeaders: SpotifyAuthHeaders =
      await getSpotifyAuthHeaders();

    const body = await req.json();

    const searchTerm =
      "https://api.spotify.com/v1/search?q=artist%3A" +
      body.searchTerm.replace(/\s+/g, "%20") +
      "&type=artist&market=US&limit=20&offset=0";

    const artistsResponse = await axios.get(searchTerm, spotifyAuthHeaders);
    const artists = artistsResponse.data;

    return NextResponse.json(artists, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        body: { errors: "Unable to retreive artists" },
      },
      { status: 500 }
    );
  }
}
