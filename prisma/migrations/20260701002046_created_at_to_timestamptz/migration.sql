-- AlterTable
ALTER TABLE "album" ALTER COLUMN "release_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "album_on_collection" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "follow" ALTER COLUMN "followed_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "genre" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "history" ALTER COLUMN "played_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "like" ALTER COLUMN "liked_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "playlist" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "playlist_on_collection" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "track" ALTER COLUMN "release_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "track_on_collection" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "track_on_playlist" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMPTZ;
