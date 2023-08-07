import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //add rule to check if user is authenticated before accessing data
  console.log("middleware");

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/spotify_requests/:path*"], //don't know if i did this right
};
