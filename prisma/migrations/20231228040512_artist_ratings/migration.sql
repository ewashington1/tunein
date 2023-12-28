-- CreateTable
CREATE TABLE "ArtistRating" (
    "artistId" TEXT NOT NULL,
    "stars" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistRating_pkey" PRIMARY KEY ("userId","artistId")
);

-- AddForeignKey
ALTER TABLE "ArtistRating" ADD CONSTRAINT "ArtistRating_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistRating" ADD CONSTRAINT "ArtistRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
