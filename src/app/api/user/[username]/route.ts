import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
import { NextRequest } from "next/server";
export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const param = await params;

    if (!param?.username) {
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
    const userLibrary = await prisma.user.findUnique({
      where: { username: param.username },
      select: {
        id: true,
        biography: true,
        displayUsername: true,
        avatar: true,
        location: true,
        _count: { select: { following: true, followedBy: true } },
        username: true,
        updatedAt: true,
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
    const { _count, ...user } = userLibrary;
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { ...user, following: _count.following, followedBy: _count.followedBy },
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
