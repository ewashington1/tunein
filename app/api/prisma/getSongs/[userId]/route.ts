import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { User } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    const ratedSongs = await prisma.song.findMany({
      // find songs where session user is following the user who created a songRating for said song
      where: {
        songRatings: {
          some: {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        },
      },
      include: {
        songRatings: {
          where: {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        artists: true,
      },
    });

    const ratedAlbums = await prisma.album.findMany({
      where: {
        albumRatings: {
          some: {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        },
      },
      // include the album details for the card
      include: {
        albumRatings: {
          where: {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        artists: true,
      },
    });

    const ratedItems = [...ratedSongs, ...ratedAlbums];

    // ratedItems.sort((a, b) => {
    //   if (a.createdAt > b.createdAt) {
    //     return -1;
    //   }
    //   if (a.createdAt < b.createdAt) {
    //     return 1;
    //   }
    //   return 0;
    // });

    return NextResponse.json({ feed: ratedItems }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to retreive users." } },
      { status: 500 }
    );
  }
}
