import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import prisma from "@/config/db";
import { onSuccessRequest, onThrowError } from "@/apiService";
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
        image: true,
        release_date: true,
        copyright: true,
        artist: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
        _count: { select: { tracks: { where: { album_id: id } } } },
        tracks: {
          select: {
            order_in_album: true,
            track: {
              select: {
                artists: { select: { artist: { select: { name: true, id: true } } } },
                reproductions: true,
                duration: true,
                name: true,
                song: true,
                id: true,
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

    const duration = response.tracks.map((track) => track.track.duration).reduce((a, b) => a + b);

    return onSuccessRequest({
      httpStatusCode: 200,
      data: { ...response, duration },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
