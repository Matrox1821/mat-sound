import { onSuccessRequest, onThrowError } from "@/apiService";
import { getArtistsByPagination } from "@/shared/server/artist/artistRepository";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;
  const rows = Number(req.nextUrl.searchParams.get("rows")) || 6;

  try {
    const artists = await getArtistsByPagination({ page, rows });
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: artists,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
