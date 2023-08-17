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
      "https://api.spotify.com/v1/search?q=track%3A" +
      body.searchTerm.replace(/\s+/g, "%20") +
      "&type=track&market=US&limit=20&offset=0";
    console.log("Search term: " + searchTerm);

    const tracksResponse = await axios.get(searchTerm, spotifyAuthHeaders);
    const tracks = tracksResponse.data;

    return NextResponse.json(tracks, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        body: { errors: "Unable to retreive songs" },
      },
      { status: 500 }
    );
  }
}
