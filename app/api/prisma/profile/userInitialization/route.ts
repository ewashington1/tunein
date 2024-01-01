import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/api/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// body type
type UserInitializationBody = { username: string; password: string };

export async function PATCH(req: NextRequest) {
  try {
    //get session user
    const session = await getServerSession(authOptions);

    const body: UserInitializationBody = await req.json();

    //update username
    const username = body.username;

    //update password
    const rawPassword = body.password;

    //if user updated password
    if (rawPassword) {
      //hash password
      const bcrypt = require("bcrypt");
      const saltRounds = 10;
      const password = rawPassword;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await prisma.user.update({
        where: { id: session!.user!.id! },
        data: {
          password: hashedPassword,
          username: username,
        },
      });
    }
    // if user only updated email
    else {
      await prisma.user.update({
        where: { id: session!.user!.id! },
        data: {
          username: username,
        },
      });
    }

    console.log("User initialization success");

    return NextResponse.json("Fields updated successfully", { status: 200 });
  } catch (err) {
    // if unique constraint failed on username, usernameTaken: true
    if (err.code === "P2002") {
      return NextResponse.json({ usernameTaken: true }, { status: 500 });
    } else {
      return NextResponse.json({ unknownError: true }, { status: 500 });
    }
  }
}
