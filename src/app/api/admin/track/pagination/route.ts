import { onSuccessRequest, onThrowError } from "@/apiService";
import { getTracksPaginationInfo } from "@/shared/server/track/track.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const artistName = params.get("artistName") || "";
  const albumName = params.get("albumName") || "";
  const trackName = params.get("trackName") || "";
  try {
    const info = await getTracksPaginationInfo({ artistName, albumName, trackName });
    return onSuccessRequest({
      httpStatusCode: 200,
      data: { ...info },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
