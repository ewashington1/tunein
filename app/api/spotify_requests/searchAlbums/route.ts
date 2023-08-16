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

    //maybe should still have type=track, but still search thru artists and tracks
    //like https://api.spotify.com/v1/search?q=track%3ADrake&type=artist%2Ctrack&market=US&limit=20&offset=0
    const searchTerm =
      "https://api.spotify.com/v1/search?q=album%3A" +
      body.searchTerm.replace(/\s+/g, "%20") +
      "&type=album&market=US&limit=20&offset=0";

    const albumsResponse = await axios.get(searchTerm, spotifyAuthHeaders);
    const albums = albumsResponse.data;

    return NextResponse.json(albums, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        body: { errors: "Unable to retreive albums" },
      },
      { status: 500 }
    );
  }
}
