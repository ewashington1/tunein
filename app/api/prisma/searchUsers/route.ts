import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { User } from "@prisma/client";

type SearchUserRequest = NextRequest & {
  req: { body: { searchTerm: string } };
};

export async function POST(req: SearchUserRequest) {
  try {
    const body = await req.json();

    let users: User[] | null;

    //get users with matching username to search
    users = await prisma.user.findMany({
      where: {
        username: {
          startsWith: body.searchTerm,
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
