import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { User } from "@prisma/client";

//route.ts

type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    console.log("here");
    const body: LoginRequest = await req.json();

    const bcrypt = require("bcrypt");

    let user: User | null;

    //get user if usernameOrEmail is user
    //use select for only the credentials you need
    if (body.usernameOrEmail.includes("@")) {
      user = await prisma.user.findUnique({
        where: {
          email: body.usernameOrEmail,
        },
      });
    }
    //get user if username or email is username
    else {
      user = await prisma.user.findUnique({
        where: {
          username: body.usernameOrEmail,
        },
      });
    }

    const passwordMatches = await bcrypt.compare(body.password, user?.password);

    //check if password matches
    if (passwordMatches) {
      //set auth if password matches
      return NextResponse.json(
        {
          user: {
            id: user!.id,
            username: user!.username,
            name: user!.name,
            email: user!.email,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { errors: { login: "Invalid username or password." } },
        { status: 401 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { errors: { login: "Invalid username or password." } },
      { status: 500 }
    );
  }
}
