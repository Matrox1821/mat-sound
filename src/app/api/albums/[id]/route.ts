import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await prisma.album.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        cover: true,
        release_date: true,
        artists: {
          select: {
            id: true,
            avatar: true,
            name: true,
          },
        },
        _count: { select: { tracks: { where: { album: { id } } } } },
        tracks: {
          select: {
            order: true,
            disk: true,
            track: {
              select: {
                artists: {
                  select: {
                    name: true,
                    id: true,
                    avatar: true,
                  },
                },
                albums: {
                  select: { album: { select: { name: true, id: true } } },
                },
                lyrics: true,
                reproductions: true,
                duration: true,
                name: true,
                song: true,
                id: true,
                cover: true,
              },
            },
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

    const duration = response.tracks.map(({ track }) => track.duration).reduce((a, b) => a + b);

    return onSuccessRequest({
      httpStatusCode: 200,
      data: { ...response, duration },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
