import { onSuccessRequest, onThrowError } from "@/apiService";
import { getAlbumsByPagination } from "@/shared/server/album/albumRepository";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;
  const rows = Number(req.nextUrl.searchParams.get("rows")) || 6;

  try {
    const albums = await getAlbumsByPagination({ page, rows });
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: albums,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
