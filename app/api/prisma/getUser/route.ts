import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { User } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    //get the current session users information
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({ user: user }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Unable to retreive users." } },
      { status: 500 }
    );
  }
}
