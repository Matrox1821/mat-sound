import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const userLibrary = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        biography: true,
        displayUsername: true,
        image: true,
        location: true,
        collection: {
          include: {
            playlists: {
              include: {
                playlist: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                    tracks: {
                      take: 4,
                      orderBy: { added_at: "desc" },
                      select: { track: { select: { cover: true } } },
                    },
                  },
                },
              },
            },
            albums: {
              include: {
                album: {
                  select: {
                    id: true,
                    name: true,
                    cover: true,
                    artists: { select: { name: true, id: true, avatar: true } },
                  },
                },
              },
            },
            tracks: {
              include: {
                track: {
                  include: {
                    artists: { select: { id: true, avatar: true, name: true } },
                  },
                  omit: {
                    created_at: true,
                    release_date: true,
                    updated_at: true,
                  },
                },
              },
            },
          },
        },
        following: { include: { artist: { select: { id: true, avatar: true, name: true } } } },
        history: true,
        playlists: true,
        likes: true,
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
      data: userLibrary,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
