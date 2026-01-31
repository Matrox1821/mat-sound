import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.CLOUDFLARE_ENDPOINT;
const accessKeyId = process.env.CLOUDFLARE_ACCESS_KEY;
const secretAccessKey = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;

if (!endpoint) {
  throw new Error("Faltan variables de entorno de Cloudflare (ENDPOINT)");
}
if (!accessKeyId) {
  throw new Error("Faltan variables de entorno de Cloudflare (ACCESS_KEY)");
}
if (!secretAccessKey) {
  throw new Error("Faltan variables de entorno de Cloudflare (SECRET_KEY)");
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: endpoint || "",
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export { s3Client };
