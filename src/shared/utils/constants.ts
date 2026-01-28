const GET_URL =
  process.env.NODE_ENV === "production" ? "https://mat-sound.vercel.app/" : "http://localhost:3000";

const MAX_SIZE_MOBILE = 768;

const GET_BUCKET_URL = process.env.CLOUDFLARE_PUBLIC_ENDPOINT;

export { GET_URL, MAX_SIZE_MOBILE, GET_BUCKET_URL };
