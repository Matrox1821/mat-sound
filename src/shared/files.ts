import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY || "",
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "",
  },
});
export async function uploadFileToBucket(file: File, fileName: string) {
  const Key = fileName;
  const Bucket = "mat-sound";
  try {
    const parallelUploads = new Upload({
      client: S3,
      params: {
        Bucket,
        Key,
        Body: file.stream(),
        ACL: "public-read",
        ContentType: file.type,
      },
    });
    let res = await parallelUploads.done();

    if (!res) {
      throw new CustomError({
        errors: [
          {
            message: `Error to update ['${file.name}'] how ['${fileName}]' in R2 bucket.`,
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

export async function deleteFileToBucket(file: File, fileName: string) {
  const Key = fileName;
  const Bucket = "mat-sound";
  try {
    const deleteObject = new DeleteObjectCommand({
      Bucket,
      Key,
    });
    const res = await S3.send(deleteObject);
    if (!res) {
      throw new CustomError({
        errors: [
          {
            message: `Error to update ['${file.name}'] how ['${fileName}]' in R2 bucket.`,
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
