/*
  Warnings:

  - You are about to drop the column `createdAt` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `verification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `verification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_at` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayUsername` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "release_date" SET DEFAULT now(),
ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "AlbumOnCollection" ALTER COLUMN "added_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "followed_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Genre" ALTER COLUMN "added_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "History" ALTER COLUMN "playedAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "liked_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Playlist" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "PlaylistOnCollection" ALTER COLUMN "added_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "release_date" SET DEFAULT now(),
ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "TrackOnCollection" ALTER COLUMN "added_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "TrackOnPlaylist" ALTER COLUMN "added_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "account" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "displayUsername" TEXT NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "verification" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
