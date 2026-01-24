import { CustomError } from "@/types/error.type";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { getAlbumById } from "@/shared/server/album/album.repository";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await getAlbumById(id);

    if (!response) {
      throw new CustomError({
        errors: [
          {
            message: `Album with ID ${id} was not found in our records.`,
          },
        ],
        msg: "Resource not found",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return onSuccessRequest({
      httpStatusCode: 200,
      data: response,
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
