import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { FeedItem } from "../../../home/page";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    const ratedSongs: FeedItem[] = await prisma.song.findMany({
      // find songs where session user is following the user who created a songRating for said song
      where: {
        songRatings: {
          //song ratings that contains a user whos followers contain the current user
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
        // for rating info on feed card
        songRatings: {
          //INCLUDE song ratings (include song ratings in song we're getting) where the logged in user follows the "rater"
          where: {
            user: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
          // for rater info on feed card - include song rating's user
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
          // sort to get the most recent song rating first
          orderBy: {
            createdAt: "desc",
          },
        },
        // for artist info on feed card
        artists: true,
      },
      // sort to get the most recent song first based on the song rating
      //   doesnt work but it should as its in the prisma documentation
      //   orderBy: {
      //     songRatings: {
      //       createdAt: "desc",
      //     },
      //   },
    });

    const ratedAlbums: FeedItem[] = await prisma.album.findMany({
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
          orderBy: {
            createdAt: "desc",
          },
        },
        artists: true,
      },
      //   orderBy: {
      //     albumRatings: {
      //       createdAt: "desc",
      //     },
      //   },
    });

    const ratedItems = [...ratedSongs, ...ratedAlbums];

    // sorting ratedItems by the most recent ratings (interlacing songs and albums)
    ratedItems.sort((a, b) => {
      const latestRatingA =
        a.songRatings !== undefined
          ? a.songRatings[0].createdAt
          : a.albumRatings![0].createdAt;
      const latestRatingB =
        b.songRatings !== undefined
          ? b.songRatings[0].createdAt
          : b.albumRatings![0].createdAt;
      if (latestRatingA > latestRatingB) {
        return -1;
      }
      if (latestRatingA < latestRatingB) {
        return 1;
      }
      return 0;
    });

    return NextResponse.json({ feed: ratedItems }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: "Unable to retreive feed." },
      { status: 500 }
    );
  }
}
