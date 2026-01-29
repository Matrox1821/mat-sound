import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";
import { resizeAvatarUser, uploadFileToBucket } from "../files";

export const handleAvatarUpload = async (
  file: File | null,
  id: string,
): Promise<{
  buffer: Buffer;
  dbPath: string;
  r2Path: string;
  avatarUploads: CompleteMultipartUploadCommandOutput | undefined;
} | null> => {
  if (!file) return null;
  const result = await resizeAvatarUser({ file, id });
  if (!result) throw new Error("Error resizing avatar");
  const { buffer, dbPath, r2Path } = result;
  const avatarUploads = await uploadFileToBucket(buffer, r2Path);

  return { buffer, dbPath, r2Path, avatarUploads };
};
