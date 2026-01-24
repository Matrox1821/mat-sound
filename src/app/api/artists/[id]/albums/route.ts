import { CustomError } from "@/types/error.type";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await prisma.album.findMany({
      where: {
        artists: {
          some: {
            id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        cover: true,
        releaseDate: true,
      },
    });
    if (!response || response.length === 0) {
      throw new CustomError({
        errors: [
          {
            message: "The search returned no results. No elements were found.",
          },
        ],
        msg: "The search returned no results. No elements were found.",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }
    return onSuccessRequest({
      httpStatusCode: 200,
      data: response,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
