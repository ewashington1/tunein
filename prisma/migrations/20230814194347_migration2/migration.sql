/*
  Warnings:

  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `AlbumRating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PlaylistSong` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Song` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SongRating` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "AlbumRating" DROP CONSTRAINT "AlbumRating_albumId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_songId_fkey";

-- DropForeignKey
ALTER TABLE "SongRating" DROP CONSTRAINT "SongRating_songId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP CONSTRAINT "Album_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Album_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AlbumRating" DROP CONSTRAINT "AlbumRating_pkey",
ALTER COLUMN "albumId" SET DATA TYPE TEXT,
ADD CONSTRAINT "AlbumRating_pkey" PRIMARY KEY ("userId", "albumId");

-- AlterTable
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_pkey",
ALTER COLUMN "songId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PlaylistSong_pkey" PRIMARY KEY ("playlistId", "songId");

-- AlterTable
ALTER TABLE "Song" DROP CONSTRAINT "Song_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Song_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SongRating" DROP CONSTRAINT "SongRating_pkey",
ALTER COLUMN "songId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SongRating_pkey" PRIMARY KEY ("userId", "songId");

-- AddForeignKey
ALTER TABLE "SongRating" ADD CONSTRAINT "SongRating_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumRating" ADD CONSTRAINT "AlbumRating_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSong" ADD CONSTRAINT "PlaylistSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
