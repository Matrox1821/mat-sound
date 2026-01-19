import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
export async function GET({ params }: { params: Promise<{ id?: string }> }) {
  try {
    const param = await params;
    if (!param?.id) {
      throw new CustomError({
        errors: [
          {
            message: "User not found",
          },
        ],
        msg: "User not found",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }
    const userLibrary = await prisma.user.findFirst({
      where: { id: param.id },
      select: {
        likes: {
          select: {
            track: {
              include: {
                artists: { select: { id: true, name: true, avatar: true } },
                _count: { select: { likes: true } },
              },
            },
          },
        },
      },
    });

    if (!userLibrary) {
      throw new CustomError({
        errors: [
          {
            message: "User not found",
          },
        ],
        msg: "User not found",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: userLibrary.likes.map(({ track }) => ({
        isLiked: true,
        likes: track._count.likes,
        ...track,
      })),
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
