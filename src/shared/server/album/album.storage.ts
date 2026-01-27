import { uploadFileToBucket, resizeImage } from "@/shared/server/files";
import { ImageSizes } from "@shared-types/common.types";
import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";

export const handleCoverResizeAndUpload = async (
  file: File | null,
  id: string,
): Promise<{
  buffer: {
    sm: Buffer | null;
    md: Buffer | null;
    lg: Buffer | null;
  };
  dbPath: ImageSizes;
  r2Path: ImageSizes;
  coverUploads: (CompleteMultipartUploadCommandOutput | undefined)[];
}> => {
  const { buffer, dbPath, r2Path } = await resizeImage({ file, archiveType: "albumCover", id });
  if (!buffer || !dbPath || !r2Path) throw new Error("Error resizing cover");
  const coverUploads = await Promise.all(
    Object.entries(r2Path).map(async ([key, path]) => {
      const currentBuffer = buffer[key as "sm" | "md" | "lg"];
      if (currentBuffer) return uploadFileToBucket(currentBuffer, path);
    }),
  );
  return { buffer, dbPath, r2Path, coverUploads };
};
