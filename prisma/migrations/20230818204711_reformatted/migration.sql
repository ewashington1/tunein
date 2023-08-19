/*
  Warnings:

  - You are about to drop the column `albumId` on the `Song` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preview_url` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumId_fkey";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "preview_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "albumId";
