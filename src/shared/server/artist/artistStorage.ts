import { uploadFileToBucket, resizeImage } from "@/shared/server/files";
import { formatR2FilePath } from "@/shared/utils/helpers";

export const handleAvatarResizeAndUpload = async (file: File | null, id: string) => {
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

export const uploadMainCover = async (file: File | null, id: string) => {
  if (!file) throw new Error("Error to upload main cover in bucket");
  const path = formatR2FilePath({ type: "mainCover", id });
  await uploadFileToBucket(file, path);
  return path;
};

export const uploadCovers = async (covers: File[] | null, id: string) => {
  if (!covers) throw new Error("Error to upload main cover in bucket");

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
