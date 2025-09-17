import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import prisma from "@/config/db";
import { onSuccessRequest, onThrowError } from "@/apiService";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await prisma.track.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        image: true,
        release_date: true,
        copyright: true,
        artists: { select: { artist: { select: { id: true, image: true, name: true } } } },
        duration: true,
        song: true,
        likes: true,
        reproductions: true,
        albums: { select: { album: { select: { id: true, image: true, name: true } } } },
      },
    });

    if (!response) {
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
