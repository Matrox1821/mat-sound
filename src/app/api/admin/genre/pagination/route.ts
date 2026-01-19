import { onSuccessRequest, onThrowError } from "@/apiService";
import { getGenresPaginationInfo } from "@/shared/server/genre/genre.service";

export async function GET() {
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
