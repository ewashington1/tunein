import axios, { AxiosResponse } from "axios";
import redis from "../redis";

export type SpotifyAuthHeaders = {
  headers: {
    Authorization: string;
  };
};

export async function getSpotifyAuthHeaders(): Promise<SpotifyAuthHeaders> {
  const spotifyToken = await getSpotifyToken(); //error here
  const authHeader: SpotifyAuthHeaders = {
    headers: { Authorization: `Bearer ${spotifyToken!}` },
  };
  return authHeader;
}

const authOptions = {
  method: "post",
  url: "https://accounts.spotify.com/api/token",
  headers: {
    "Authorization": `Basic ${Buffer.from(
      process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
    ).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  data: "grant_type=client_credentials", //because axios send it a little differently
};

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

//fetches token from Spotify aPI
//change promise type from any -- didnt fee
export default async function fetchSpotifyToken(): Promise<SpotifyTokenResponse | null> {
  try {
    const response: AxiosResponse<SpotifyTokenResponse> = await axios(
      authOptions
    );
    if (response.status === 200) {
      // Use the token as needed
      console.log(response.data);
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching Spotify access token.", error);
    return null;
  }
}

//you also could just set the spotify token if not existing and then return it
//but dont use the setter function because it will fetch it from the spotify api every time if so
export async function getSpotifyToken(): Promise<string> {
  let token: string | null = await redis.get("spotify_access_token");

  if (!token) {
    token = await setSpotifyToken();
  }
  console.log("Got token " + token);
  return token;
}

//come up with handling for if fetchSpotifyToken is null
//also fix types having to do with that
export async function setSpotifyToken(): Promise<string> {
  const spotify_access_token_response: SpotifyTokenResponse | null =
    await fetchSpotifyToken();

  //setting key to expire in 60 minutes
  redis.set(
    "spotify_access_token",
    spotify_access_token_response!.access_token,
    {
      ex: 3600, //set to expire in 60 min
      nx: true, //only set if key is not existing (nx)
    }
  );
  return spotify_access_token_response!.access_token;
}
