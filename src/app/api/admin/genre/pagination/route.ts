import { onSuccessRequest, onThrowError } from "@/apiService";
import { getGenresPaginationInfo } from "@/shared/server/genre/genreService";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const info = await getGenresPaginationInfo();
    return onSuccessRequest({
      httpStatusCode: 200,
      data: { ...info },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
