import { onSuccessRequest, onThrowError } from "@/apiService";
import { getAlbumsPaginationInfo } from "@/shared/server/album/albumService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const info = await getAlbumsPaginationInfo();
    return onSuccessRequest({
      httpStatusCode: 200,
      data: info,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
