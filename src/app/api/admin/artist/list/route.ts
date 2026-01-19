import { onSuccessRequest, onThrowError } from "@/apiService";
import { getArtistsByPagination } from "@/shared/server/artist/artist.repository";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get("page")) || 1;
  const rows = Number(req.nextUrl.searchParams.get("rows")) || 6;
  const query = req.nextUrl.searchParams.get("query") || "";

  try {
    const artists = await getArtistsByPagination({ page, rows, query });
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: artists,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
