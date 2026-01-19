import { onSuccessRequest, onThrowError } from "@/apiService";
import { getTracksByPagination } from "@/shared/server/track/track.repository";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Number(params.get("page")) || 1;
  const rows = Number(params.get("rows")) || 6;
  const artistName = params.get("artistName") || "";
  const albumName = params.get("albumName") || "";
  const trackName = params.get("trackName") || "";

  try {
    const genres = await getTracksByPagination({ page, rows, artistName, albumName, trackName });
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: genres,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
