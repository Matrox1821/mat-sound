import { onSuccessRequest, onThrowError } from "@/apiService";
import { getAlbumsPaginationInfo } from "@/shared/server/album/album.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const artistName = req.nextUrl.searchParams.get("artistName") || "";
  const albumName = req.nextUrl.searchParams.get("albumName") || "";
  try {
    const info = await getAlbumsPaginationInfo({ artistName, albumName });
    return onSuccessRequest({
      httpStatusCode: 200,
      data: info,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
