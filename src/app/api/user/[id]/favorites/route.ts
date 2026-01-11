import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const userLibrary = await prisma.user.findFirst({
      where: { id },
      select: {
        likes: {
          select: {
            track: { include: { artists: { select: { id: true, name: true, avatar: true } } } },
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
      data: userLibrary.likes.map(({ track }) => track),
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
