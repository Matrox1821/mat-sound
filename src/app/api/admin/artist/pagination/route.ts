import { onSuccessRequest, onThrowError } from "@/apiService";
import { getArtistsPaginationInfo } from "@/shared/server/artist/artistService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const info = await getArtistsPaginationInfo();
    return onSuccessRequest({
      httpStatusCode: 200,
      data: info,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
