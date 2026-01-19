"use server";
import { uploadFileToBucket, resizeImage } from "@/shared/server/files";
import { formatR2FilePath } from "@/shared/utils/helpers";

export const handleTrackResizeAndUpload = async (file: File | null, id: string) => {
  const { buffer, dbPath, r2Path } = await resizeImage({ file, archiveType: "trackCover", id });
  if (!buffer || !dbPath || !r2Path) throw new Error("Error resizing track");
  const trackUploads = await Promise.all(
    Object.entries(r2Path).map(async ([key, path]) => {
      const currentBuffer = buffer[key as "sm" | "md" | "lg"];
      if (currentBuffer) return uploadFileToBucket(currentBuffer, path);
    })
  );
  return { buffer, dbPath, r2Path, trackUploads };
};

export const uploadSong = async (file: File | null, id: string) => {
  if (!file) throw new Error("Error to upload song in bucket");
  const path = formatR2FilePath({ type: "trackSong", id });
  await uploadFileToBucket(file, path);
  return path;
};
