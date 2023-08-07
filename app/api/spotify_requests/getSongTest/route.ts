import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { SpotifyAuthHeaders, getSpotifyAuthHeaders } from "../spotifyAuth";

export async function POST(req: NextRequest) {
  try {
    const spotifyAuthHeaders: SpotifyAuthHeaders =
      await getSpotifyAuthHeaders();

    const testSong = await axios.get(
      "https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl",
      spotifyAuthHeaders
    );

    const songBody = testSong.data;

    console.log("SONG BODY");
    console.log(songBody); //successfully getting testSong

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
