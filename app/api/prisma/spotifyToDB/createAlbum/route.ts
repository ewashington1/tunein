import { Artist, SimplifiedArtist, Album } from "@spotify/web-api-ts-sdk";
import { prisma } from "@/app/api/prisma";

export async function createAlbum(album: Album) {
  const result = await prisma.album.upsert({
    where: { id: album.id },
    update: {},
    create: {
      id: album.id,
      name: album.name,
      image_url: album.images[0].url,
      artists: {
        connectOrCreate: album.artists.map((artist: SimplifiedArtist) => ({
          where: { id: artist.id },
          create: {
            id: artist.id,
            name: artist.name,
          },
        })),
      },
    },
  });
  return result;
}
