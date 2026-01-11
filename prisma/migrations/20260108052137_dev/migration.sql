/*
  Warnings:

  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE "user" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT now();
