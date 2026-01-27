import { onSuccessRequest, onThrowError } from "@/apiService";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { NextRequest } from "next/server";
import { parseAlbumFormData, parseUpdatedAlbumFormData } from "@/shared/formData/albumForm";
import {
  createAlbum,
  deleteAlbumById,
  updateAlbumCover,
} from "@/shared/server/album/album.repository";
import { handleCoverResizeAndUpload } from "@/shared/server/album/album.storage";
import { prisma } from "@config/db";
import { validateAlbumUniqueness } from "@/shared/server/album/album.service";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = parseAlbumFormData(formData);

    await validateAlbumUniqueness({ name: body.name });
    const album = await createAlbum(body);

    const cover = body.cover && (await handleCoverResizeAndUpload(body.cover, album.id));

    const updatedAlbum = await updateAlbumCover({
      albumId: album.id,
      paths: cover ? cover.dbPath : null,
    });

    if (body.tracksOrder && Object.entries(body.tracksOrder).length > 0) {
      await prisma.album.update({
        where: { id: album.id },
        data: {
          tracks: {
            create: Object.entries(body.tracksOrder).map(([trackId, info]: [string, any]) => ({
              order: info.order,
              disk: info.disk,
              track: {
                connect: { id: trackId },
              },
            })),
          },
        },
      });
    }
    if (!updatedAlbum) {
      await Promise.all([deleteAlbumById(album.id)]);
      throw new CustomError({
        errors: [{ message: "The album has not been updated" }],
        msg: "The album has not been updated",
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
    return onSuccessRequest({
      httpStatusCode: 200,
      data: updatedAlbum,
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams.getAll("artists_id") as string | string[];
    if (searchParams) {
      let albums = [];
      const newArtistsId = [...searchParams];

      albums = await prisma.album.findMany({
        where: {
          artists: {
            some: { id: { in: newArtistsId } },
          },
        },
      });

      if (albums.length === 0) {
        throw new CustomError({
          errors: [{ message: "Album not found." }],
          msg: "Album not found.",
          httpStatusCode: HttpStatusCode.NOT_FOUND,
        });
      }
      return onSuccessRequest({
        httpStatusCode: 200,
        data: albums,
      });
    }
    const albums = await prisma.album.findMany({
      select: { name: true, id: true, cover: true },
      orderBy: { name: "asc" },
    });
    return onSuccessRequest({
      httpStatusCode: 200,
      data: albums,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const {
      id,
      cover,
      releaseDate,
      artists: _,
      tracks: __,
      tracksOrder: ___,
      ...data
    } = parseUpdatedAlbumFormData(formData);
    if (!id) return;
    if (cover) {
      const { dbPath } = await handleCoverResizeAndUpload(cover, id);

      await updateAlbumCover({ albumId: id, paths: dbPath });
    }
    await prisma.album.update({
      where: { id },
      data: { ...data, releaseDate: new Date(releaseDate) },
    });

    return onSuccessRequest({
      httpStatusCode: 200,
      data: null,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
