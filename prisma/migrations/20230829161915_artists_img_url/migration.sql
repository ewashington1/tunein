-- DropForeignKey
ALTER TABLE "TopAlbums" DROP CONSTRAINT "TopAlbums_userId_fkey";

-- DropForeignKey
ALTER TABLE "TopAlbumsAlbum" DROP CONSTRAINT "TopAlbumsAlbum_topAlbumsId_fkey";

-- DropForeignKey
ALTER TABLE "TopArtists" DROP CONSTRAINT "TopArtists_userId_fkey";

-- DropForeignKey
ALTER TABLE "TopArtistsArtist" DROP CONSTRAINT "TopArtistsArtist_topArtistsId_fkey";

-- DropForeignKey
ALTER TABLE "TopSongs" DROP CONSTRAINT "TopSongs_userId_fkey";

-- DropForeignKey
ALTER TABLE "TopSongsSong" DROP CONSTRAINT "TopSongsSong_topSongsId_fkey";

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "image_url" TEXT;

-- AddForeignKey
ALTER TABLE "TopAlbums" ADD CONSTRAINT "TopAlbums_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopArtists" ADD CONSTRAINT "TopArtists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSongs" ADD CONSTRAINT "TopSongs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopAlbumsAlbum" ADD CONSTRAINT "TopAlbumsAlbum_topAlbumsId_fkey" FOREIGN KEY ("topAlbumsId") REFERENCES "TopAlbums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopArtistsArtist" ADD CONSTRAINT "TopArtistsArtist_topArtistsId_fkey" FOREIGN KEY ("topArtistsId") REFERENCES "TopArtists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSongsSong" ADD CONSTRAINT "TopSongsSong_topSongsId_fkey" FOREIGN KEY ("topSongsId") REFERENCES "TopSongs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
