import { Artist } from "@spotify/web-api-ts-sdk";
import { prisma } from "../prisma";

export async function createArtist(artist: Artist) {
  const newArtist = await prisma.artist.upsert({
    where: { id: artist.id },
    update: {},
    create: {
      id: artist.id,
      name: artist.name,
    },
  });
}
