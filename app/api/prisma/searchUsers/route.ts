import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { User } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

type SearchUserRequest = NextRequest & {
  req: { body: { searchTerm: string } };
};

export async function POST(req: SearchUserRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session!.user.id;

    const body = await req.json();

    let users: User[] | null;

    //get users with matching username to search
    users = await prisma.user.findMany({
      where: {
        username: {
          startsWith: body.searchTerm,
        },
        NOT: {
          id: userId,
        },
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { errors: { login: "Unable to retreive users." } },
      { status: 500 }
    );
  }
}
