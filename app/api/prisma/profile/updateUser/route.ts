import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/api/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const userId = body.userId;
    const name = body.name;
    const bio = body.bio;

    if (userId === session?.user.id) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name,
          bio: bio ? bio : undefined,
        },
      });

      return NextResponse.json(updatedUser, { status: 200 });
    } else {
      throw new Error("Session user doesn't match attempted update user");
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ errors: err }, { status: 500 });
  }
}
