import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";

export async function getPresignedUrl(key: string, contentType: "image/webp" | "audio/mpeg") {
  return await handleCustomApiRequest<{ url: string }>(
    GET_URL + `/api/presigned?key=${key}&content_type=${contentType}`,
    "GET"
  );
}
