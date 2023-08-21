import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../prisma";

export interface User {
  email: string;
  password: string;
  name: string;
  username: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    //use async version of bcrypt because bcrypt is cpu intensive
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const password = body.password;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        name: body.name,
      },
    });

    //set next auth b/c signed in

    return NextResponse.json({ user: newUser });
  } catch (err: any) {
    //error codes: https://themeisle.com/blog/what-are-http-error-codes/#gref

    const errorMessage: string = err.message;
    const errorCode = err.code;

    //error code for unique constraint violation
    if (errorCode === "P2002") {
      //sends 409 error (conflict error)
      if (errorMessage.includes("username")) {
        return NextResponse.json(
          { errors: { username: "Username is already taken." } },
          { status: 409 }
        );
      } else if (errorMessage.includes("email")) {
        return NextResponse.json(
          {
            errors: {
              email: "Email is already taken.",
            },
          },
          { status: 409 }
        );
      }
    } else {
      //sends 500 error (generic I think)
      return NextResponse.json(
        { errors: { unknown: "An unknown error occurred" } },
        { status: 500 }
      );
    }
  }
}
