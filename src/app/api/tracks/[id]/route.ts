import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import {
  getTracksWithoutTrackById,
  getTrackWithRecommendationsService,
} from "@/shared/server/track/track.service";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const limit = req.nextUrl.searchParams.get("limit");
    const excludeId = req.nextUrl.searchParams.get("exclude_id") || "";
    if (!!limit && excludeId !== "") {
      const tracks = await getTracksWithoutTrackById({
        limit: Number(limit),
        trackId: id,
      });

      return onSuccessRequest({
        httpStatusCode: HttpStatusCode.OK,
        data: tracks,
      });
    }
    /* let trackResponse; */
    const response = await getTrackWithRecommendationsService({ limit: 1, trackIds: [id] });

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: response,
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
