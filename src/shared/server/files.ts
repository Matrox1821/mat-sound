import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "./s3Client";
import { GET_BUCKET_URL } from "../utils/constants";
import { formatR2FilePath } from "../utils/helpers";
import sharp from "sharp";

export async function uploadFileToBucket(file: File | Buffer, fileName: string) {
  const Key = fileName;
  const Bucket = "mat-sound";
  const ContentType = file instanceof File ? file.type : "image/webp";
  try {
    const parallelUploads = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: file,
        ACL: "public-read",
        ContentType,
      },
    });
    let res = await parallelUploads.done();

    if (!res) {
      throw new CustomError({
        errors: [
          {
            message: `Error to update file how ['${fileName}]' in R2 bucket.`,
          },
        ],
        msg: "Error to update file in R2 bucket.",
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteFileToBucket(file: File | Buffer | null, fileName: string) {
  const Key = fileName;
  const Bucket = "mat-sound";
  try {
    const deleteObject = new DeleteObjectCommand({
      Bucket,
      Key,
    });
    const res = await s3Client.send(deleteObject);
    if (!res) {
      throw new CustomError({
        errors: [
          {
            message: `Error to update file how ['${fileName}]' in R2 bucket.`,
          },
        ],
        msg: "Error to update file in R2 bucket.",
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type ImageVariant = {
  dbPath: ImageSizes | null;
  r2Path: ImageSizes | null;
  buffer: { sm: Buffer | null; md: Buffer | null; lg: Buffer | null };
};

type ImageSizes = {
  sm: string;
  md: string;
  lg: string;
};

export const resizeImage = async ({
  file,
  archiveType,
  id,
}: {
  file: File | null;
  archiveType:
    | "avatar"
    | "covers"
    | "mainCover"
    | "albumCover"
    | "trackCover"
    | "trackSong"
    | "playlist"
    | "users";
  id: string;
}): Promise<ImageVariant> => {
  const sizes = {
    sm: 300,
    md: 800,
    lg: 1600,
  };
  const result: ImageVariant = {
    dbPath: { sm: "", md: "", lg: "" },
    r2Path: { sm: "", md: "", lg: "" },
    buffer: { sm: null, md: null, lg: null },
  };

  if (!file) return result;
  const buffer = await file.arrayBuffer();

  await Promise.all(
    Object.entries(sizes).map(async ([key, size]) => {
      const dbPath =
        GET_BUCKET_URL +
        formatR2FilePath({ type: archiveType, id, size: key as "sm" | "md" | "lg" });
      const r2Path = formatR2FilePath({
        type: archiveType,
        id,
        size: key as "sm" | "md" | "lg",
      });

      const risizedBuffer = await sharp(buffer).clone().resize(size).toFormat("webp").toBuffer();

      result.buffer[key as "sm" | "md" | "lg"] = risizedBuffer;
      result.dbPath![key as "sm" | "md" | "lg"] = dbPath;
      result.r2Path![key as "sm" | "md" | "lg"] = r2Path;
    })
  );

  return result;
};
