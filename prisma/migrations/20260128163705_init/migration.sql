-- AlterTable
ALTER TABLE "album" ALTER COLUMN "release_date" SET DEFAULT now(),
ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "album_on_collection" ALTER COLUMN "added_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "artist" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "follow" ALTER COLUMN "followed_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "genre" ALTER COLUMN "added_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "history" ALTER COLUMN "played_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "like" ALTER COLUMN "liked_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "playlist" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "playlist_on_collection" ALTER COLUMN "added_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "track" ALTER COLUMN "release_date" SET DEFAULT now(),
ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "track_on_collection" ALTER COLUMN "added_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "track_on_playlist" ALTER COLUMN "added_at" SET DEFAULT now();
