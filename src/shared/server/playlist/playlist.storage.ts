import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";
import { resizeCoverPlaylist, uploadFileToBucket } from "../files";
import { ImageSizes } from "@/types/common.types";

export const handleCoverUpload = async (
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
} | null> => {
  if (!file) return null;
  const result = await resizeCoverPlaylist({ file, id });
  if (!result) throw new Error("Error resizing cover");
  const { buffer, dbPath, r2Path } = result;
  if (!buffer || !dbPath || !r2Path) throw new Error("Error resizing cover");
  const coverUploads = await Promise.all(
    Object.entries(r2Path).map(async ([key, path]) => {
      const currentBuffer = buffer[key as "sm" | "md" | "lg"];
      if (currentBuffer) return uploadFileToBucket(currentBuffer, path);
    }),
  );
  return { buffer, dbPath, r2Path, coverUploads };
};
