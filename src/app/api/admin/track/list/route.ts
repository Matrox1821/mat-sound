import { onSuccessRequest, onThrowError } from "@/apiService";
import { getTracksByPaginationService } from "@/shared/server/track/track.service";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Number(params.get("page")) || 1;
  const rows = Number(params.get("rows")) || 6;
  const artistName = params.get("artistName") || "";
  const albumName = params.get("albumName") || "";
  const trackName = params.get("trackName") || "";

  try {
    const tracks = await getTracksByPaginationService({
      page,
      rows,
      artistName,
      albumName,
      trackName,
    });
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: tracks,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
