import { onSuccessRequest, onThrowError } from "@/apiService";
import { getGenresByPagination } from "@/shared/server/genre/genre.repository";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Number(params.get("page")) || 1;
  const rows = Number(params.get("rows")) || 6;
  try {
    const genres = await getGenresByPagination({ page, rows });
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: genres,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
