const GET_URL =
  process.env.NODE_ENV === "production"
    ? "https://learn-languages-zeta.vercel.app"
    : "http://localhost:3000";

const MAX_SIZE_MOBILE = 768;
export { GET_URL, MAX_SIZE_MOBILE };
