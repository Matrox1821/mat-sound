import { S3Client } from "@aws-sdk/client-s3";
export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_URL || "",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY || "",
  },
});
