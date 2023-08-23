import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../prisma";
import { User } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    //get the current session users information
    const user = await prisma.User.findUnique({
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
