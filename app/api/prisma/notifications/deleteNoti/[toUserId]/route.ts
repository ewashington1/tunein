import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

// NOT USED

export async function DELETE(
  req: NextRequest,
  { params }: { params: { toUserId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const fromNotiId: string = session!.user.id;

    const toUserId: string = params.toUserId;

    //deleting notification relation between two users
    await prisma.notification.delete({
      where: {
        fromUserId_toUserId: {
          fromUserId: fromNotiId,
          toUserId: toUserId,
        },
      },
    });

    return NextResponse.json(
      { message: "Notification deletion successful." },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Notification deletion unsuccessful." } },
      { status: 500 }
    );
  }
}
