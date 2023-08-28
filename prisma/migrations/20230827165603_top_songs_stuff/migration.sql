/*
  Warnings:

  - You are about to drop the column `topAlbumsId` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `topArtistsId` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `topSongsId` on the `Song` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_topAlbumsId_fkey";

-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_topArtistsId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_topSongsId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "topAlbumsId";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "topArtistsId";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "topSongsId";

-- CreateTable
CREATE TABLE "TopAlbumsAlbum" (
    "topAlbumsId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopAlbumsAlbum_pkey" PRIMARY KEY ("albumId","topAlbumsId")
);

-- CreateTable
CREATE TABLE "TopArtistsArtist" (
    "topArtistsId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopArtistsArtist_pkey" PRIMARY KEY ("artistId","topArtistsId")
);

-- CreateTable
CREATE TABLE "TopSongsSong" (
    "songId" TEXT NOT NULL,
    "topSongsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopSongsSong_pkey" PRIMARY KEY ("songId","topSongsId")
);

-- AddForeignKey
ALTER TABLE "TopAlbumsAlbum" ADD CONSTRAINT "TopAlbumsAlbum_topAlbumsId_fkey" FOREIGN KEY ("topAlbumsId") REFERENCES "TopAlbums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopAlbumsAlbum" ADD CONSTRAINT "TopAlbumsAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopArtistsArtist" ADD CONSTRAINT "TopArtistsArtist_topArtistsId_fkey" FOREIGN KEY ("topArtistsId") REFERENCES "TopArtists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopArtistsArtist" ADD CONSTRAINT "TopArtistsArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSongsSong" ADD CONSTRAINT "TopSongsSong_topSongsId_fkey" FOREIGN KEY ("topSongsId") REFERENCES "TopSongs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSongsSong" ADD CONSTRAINT "TopSongsSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
