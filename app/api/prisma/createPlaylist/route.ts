import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/prisma";
import { s3Client } from "@/app/api/s3client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

async function convert(file: Buffer, fileName: string) {
  const resizedImageBuffer = await sharp(file)
    .resize(500, 500) // Specify your desired width or height for resizing
    .toBuffer();

  return resizedImageBuffer;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();

    const name = body.get("name")?.toString();
    const description = body.get("description")?.toString();
    const userId = body.get("userId")?.toString();
    const image = body.get("image") as Blob | null;

    //only do if image isn't null
    const imageBuffer = Buffer.from(await image!.arrayBuffer());

    const mimeType = image!.type;
    const fileExtension = mimeType.split("/")[1];

    //create playlist, get id, and use id to upload image to s3
    const playlist = await prisma.playlist.create({
      data: {
        name: name!,
        description: description!,
        userId: userId!,
      },
    });

    //upload image to s3 to the playlistImages folder
    const commandParams = {
      Key: `playlistImages/${playlist.id}.${fileExtension}`,
      Bucket: "tune-in",
      Body: imageBuffer,
    };
    const command = new PutObjectCommand(commandParams);

    const s3response = await s3Client.send(command);

    //set image in prisma playlist object
    const imageUrl =
      process.env.CDN_DOMAIN +
      "playlistImages/" +
      playlist.id +
      "." +
      fileExtension;

    await prisma.playlist.update({
      where: {
        id: playlist.id,
      },
      data: { image: imageUrl },
    });

    return NextResponse.json(
      { message: "Created playlist " + name + "!" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { errors: { login: "Playlist couldn't be created." } },
      { status: 500 }
    );
  }
}
