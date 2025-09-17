import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import prisma from "@/config/db";
import { onSuccessRequest, onThrowError } from "@/apiService";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await prisma.album.findMany({
      where: {
        artist_id: id,
      },
      select: {
        id: true,
        name: true,
        image: true,
        release_date: true,
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
