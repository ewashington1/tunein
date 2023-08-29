import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { SpotifyAuthHeaders, getSpotifyAuthHeaders } from "../../spotifyAuth";
import { Artist } from "@spotify/web-api-ts-sdk";

export async function GET(
  req: NextRequest,
  { params }: { params: { artistId: string } }
) {
  try {
    const spotifyAuthHeaders: SpotifyAuthHeaders =
      await getSpotifyAuthHeaders();

    const artistId = params.artistId;

    const requestUrl: string = "https://api.spotify.com/v1/artists/" + artistId;

    const response = await axios.get(requestUrl, spotifyAuthHeaders);

    const responseData: Artist = response.data;

    const imageUrl = responseData.images[0] ? responseData.images[0].url : null;

    return NextResponse.json(imageUrl, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        body: { errors: "Unable to retreive artist image" },
      },
      { status: 500 }
    );
  }
}
