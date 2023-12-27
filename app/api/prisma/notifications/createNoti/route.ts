import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

// NOT USED

export async function POST(
  req: NextRequest & { inNotiId: string; message: string }
) {
  try {
    const session = await getServerSession(authOptions);
    const outNotidId: string = session!.user.id;

    const body = await req.json();
    const inNotiId: string = body.inNotiId;
    const message: string = body.message;

    //creating a new notification relation between two users
    await prisma.notification.create({
      data: {
        fromUser: { connect: { id: outNotidId } },
        toUser: { connect: { id: inNotiId } },
        message: message,
      },
    });

    return NextResponse.json(
      { message: "Notification successful." },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Notification unsuccessful." } },
      { status: 500 }
    );
  }
}

export default POST;
