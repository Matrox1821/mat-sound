"use server";
import { uploadFileToBucket, resizeImage } from "@/shared/server/files";
import { formatR2FilePath } from "@/shared/utils/helpers";
import { ImageSizes } from "@/types/common.types";
import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";

export const handleAvatarResizeAndUpload = async (
  file: File | null,
  id: string
): Promise<{
  buffer: {
    sm: Buffer | null;
    md: Buffer | null;
    lg: Buffer | null;
  };
  dbPath: ImageSizes;
  r2Path: ImageSizes;
  avatarUploads: (CompleteMultipartUploadCommandOutput | undefined)[];
}> => {
  const { buffer, dbPath, r2Path } = await resizeImage({ file, archiveType: "avatar", id });
  if (!buffer || !dbPath || !r2Path) throw new Error("Error resizing avatar");
  const avatarUploads = await Promise.all(
    Object.entries(r2Path).map(async ([key, path]) => {
      const currentBuffer = buffer[key as "sm" | "md" | "lg"];
      if (currentBuffer) return uploadFileToBucket(currentBuffer, path);
    })
  );
  return { buffer, dbPath, r2Path, avatarUploads };
};

export const uploadMainCover = async (file: File | null, id: string): Promise<string | null> => {
  if (!file) return null;
  const path = formatR2FilePath({ type: "mainCover", id });
  await uploadFileToBucket(file, path);
  return path;
};

export const uploadCovers = async (covers: File[] | null, id: string): Promise<string[] | null> => {
  if (!covers || covers.length === 0) return null;

  const paths = covers.map((_, i) => {
    return formatR2FilePath({ type: "covers", id, fileName: `cover-${i + 1}` });
  });
  await Promise.all(
    covers.map((cover, i) => {
      uploadFileToBucket(cover, paths[i]);
    })
  );
  return paths;
};
