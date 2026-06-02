-- AlterTable
ALTER TABLE "album" ALTER COLUMN "release_date" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "album_on_collection" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "follow" ALTER COLUMN "followed_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "genre" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "like" ALTER COLUMN "liked_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "playlist" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "playlist_on_collection" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "track" ALTER COLUMN "release_date" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "track_on_collection" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "track_on_playlist" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMP;
