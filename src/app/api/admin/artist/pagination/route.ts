import { onSuccessRequest, onThrowError } from "@/apiService";
import { getArtistsPaginationInfo } from "@/shared/server/artist/artist.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") || "";

  try {
    const info = await getArtistsPaginationInfo({ query });
    return onSuccessRequest({
      httpStatusCode: 200,
      data: info,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
