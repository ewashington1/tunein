import { NextRequest, NextResponse } from "next/server";
import {
  SpotifyAuthHeaders,
  getSpotifyAuthHeaders,
} from "@/app/api/spotify_requests/spotifyAuth";
import axios from "axios";
import { Track } from "@spotify/web-api-ts-sdk";

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

    const songDetails: Track & { lyrics: string | undefined } =
      songResponse.data;

    const musixmatchResponse = await fetchSongLyrics(
      songDetails.external_ids.isrc
    );

    songDetails.lyrics = musixmatchResponse.message.body.lyrics.lyrics_body;

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

async function fetchSongLyrics(isrc: string) {
  try {
    const musixmatchResponse = await axios.get(
      `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?track_isrc=${isrc}&apikey=${process.env.MUSIXMATCH_API_KEY}`
    );
    return musixmatchResponse.data;
  } catch (error) {
    console.log(error);
  }
}
