import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { User } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    //get the current session users following in object form
    const followingUsers = await prisma.User.findUnique({
      where: {
        id: userId,
      },
      select: {
        following: {
          select: {
            followeeId: true,
          },
        },
      },
    });

    // convert from object form to array form
    const followingIds = followingUsers?.following?.map(
      (user) => user.followeeId
    );

    if (!followingIds || followingIds.length === 0) {
      // user is not following anyone return an empty response
      return NextResponse.json({ songs: followingIds }, { status: 200 });
    }

    // get the rated songs that are rated by people user is following
    const ratedSongs = await prisma.songRating.findMany({
      where: {
        userId: {
          in: followingIds,
        },
      },
      // include the song details for the card
      include: {
        song: {
          include: {
            artists: true,
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const ratedAlbums = await prisma.albumRating.findMany({
      where: {
        userId: {
          in: followingIds,
        },
      },
      // include the album details for the card
      include: {
        album: {
          include: {
            artists: true,
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const ratedItems = [...ratedSongs, ...ratedAlbums];

    ratedItems.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    });

    return NextResponse.json({ feed: ratedItems }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to retreive users." } },
      { status: 500 }
    );
  }
}
