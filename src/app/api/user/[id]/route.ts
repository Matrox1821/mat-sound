import { CustomError } from "@/types/error.type";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
export async function GET({ params }: { params: Promise<{ id: string }> }) {
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

    const userLibrary = await prisma.user.findUnique({
      where: { id: param.id },
      select: {
        id: true,
        name: true,
        biography: true,
        displayUsername: true,
        avatar: true,
        location: true,
        collection: {
          include: {
            playlists: {
              include: {
                playlist: {
                  select: {
                    id: true,
                    name: true,
                    cover: true,
                    tracks: {
                      take: 4,
                      orderBy: { addedAt: "desc" },
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
                    createdAt: true,
                    releaseDate: true,
                    updatedAt: true,
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
    console.log(error);
    return onThrowError(error);
  }
}
