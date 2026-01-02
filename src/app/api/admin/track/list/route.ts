import { onSuccessRequest, onThrowError } from "@/apiService";
import { getTracksByPagination } from "@/shared/server/track/trackRepository";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Number(params.get("page")) || 1;
  const rows = Number(params.get("rows")) || 6;
  try {
    const genres = await getTracksByPagination({ page, rows });
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: genres,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
