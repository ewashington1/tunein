import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { s3Client } from "@/app/api/s3client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function convert(file: Buffer) {
  const resizedImageBuffer = await sharp(file)
    .resize(500, 500) // Specify your desired width or height for resizing
    .toBuffer();

  return resizedImageBuffer;
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const body = await req.formData();

    const pfp = body.get("pfp") as Blob | null;
    if (pfp !== ("null" as unknown)) {
      //only do if image isn't null
      const imageBuffer = await convert(Buffer.from(await pfp!.arrayBuffer()));

      const mimeType = pfp!.type;
      const fileExtension = mimeType.split("/")[1];

      //upload image to s3 to the playlistImages folder
      const commandParams = {
        Key: `pfps/${session!.user.id}.${fileExtension}`,
        Bucket: "tune-in",
        Body: imageBuffer,
        //setting cache to 1 minute
        Metadata: {
          "Cache-Control": "max-age=60",
        },
      };
      const command = new PutObjectCommand(commandParams);

      const s3response = await s3Client.send(command);

      //set image in prisma playlist object
      const imageUrl =
        process.env.CDN_DOMAIN +
        "pfps/" +
        session!.user.id +
        "." +
        fileExtension;

      await prisma.user.update({
        where: {
          id: session!.user.id,
        },
        data: { pfp: imageUrl },
      });
    }
    return NextResponse.json({ message: "Changed pfp!" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "PFP couldn't be edited." } },
      { status: 500 }
    );
  }
}
