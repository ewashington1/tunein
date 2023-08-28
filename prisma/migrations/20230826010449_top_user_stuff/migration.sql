-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "topAlbumsId" TEXT;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "topArtistsId" TEXT;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "topSongsId" TEXT;

-- CreateTable
CREATE TABLE "TopAlbums" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TopAlbums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopArtists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TopArtists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopSongs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TopSongs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_topSongsId_fkey" FOREIGN KEY ("topSongsId") REFERENCES "TopSongs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_topAlbumsId_fkey" FOREIGN KEY ("topAlbumsId") REFERENCES "TopAlbums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_topArtistsId_fkey" FOREIGN KEY ("topArtistsId") REFERENCES "TopArtists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopAlbums" ADD CONSTRAINT "TopAlbums_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopArtists" ADD CONSTRAINT "TopArtists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSongs" ADD CONSTRAINT "TopSongs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
