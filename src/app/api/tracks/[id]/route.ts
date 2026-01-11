import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { getTracks } from "@/shared/server/track/trackRepository";
import { prisma } from "@config/db";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const limit = req.nextUrl.searchParams.get("limit");
    if (limit) {
      const tracks = await getTracks(Number(limit), { by: "tracks", id });
      if (!tracks) {
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
        httpStatusCode: HttpStatusCode.OK,
        data: tracks,
      });
    }
    const response = await prisma.track.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        cover: true,
        release_date: true,
        artists: {
          select: { id: true, avatar: true, name: true },
        },
        duration: true,
        song: true,
        likes: true,
        reproductions: true,
        lyrics: true,
        albums: {
          select: {
            album: {
              select: { id: true, cover: true, name: true },
            },
          },
        },
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
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
      httpStatusCode: HttpStatusCode.OK,
      data: response,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
