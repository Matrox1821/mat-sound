import { onSuccessRequest, onThrowError } from "@/apiService";
import { getTracksPaginationInfo } from "@/shared/server/track/trackService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const info = await getTracksPaginationInfo();
    return onSuccessRequest({
      httpStatusCode: 200,
      data: { ...info },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
