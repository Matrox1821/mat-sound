import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { getContent } from "@/shared/server/content/contentService";

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.getAll("type") as string[];
    const limit = Number(req.nextUrl.searchParams.get("limit"));
    const filter = req.nextUrl.searchParams.get("filter") as
      | "artists"
      | "tracks"
      | "albums"
      | "playlists"
      | "none"
      | undefined;
    const filterId = req.nextUrl.searchParams.get("filter_id") ?? undefined;
    const idToRemove = req.nextUrl.searchParams.get("remove") ?? undefined;
    const response = await getContent({ type, limit, filter, filterId, idToRemove });
    return onSuccessRequest({
      httpStatusCode: 200,
      data: response,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
