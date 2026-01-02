import { onSuccessRequest, onThrowError } from "@/apiService";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { deleteFileToBucket } from "@/shared/server/files";
import { parseAlbumFormData } from "@/shared/formData/albumForm";
import {
  albumIsExists,
  createAlbum,
  deleteAlbumById,
  updateAlbumCover,
} from "@/shared/server/album/albumRepository";
import { handleCoverResizeAndUpload } from "@/shared/server/album/albumStorage";
import { prisma } from "@config/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = parseAlbumFormData(formData);

    const isExists = await albumIsExists({ name: body.name });
    if (isExists)
      throw new CustomError({
        errors: [{ message: "Album already exists." }],
        msg: "Album already exists.",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });

    const album = await createAlbum(body);

    const { buffer, coverUploads, dbPath, r2Path } = await handleCoverResizeAndUpload(
      body.cover,
      album.id
    );

    const updatedAlbum = await updateAlbumCover({ albumId: album.id, paths: dbPath });

    if (!updatedAlbum || !buffer || !coverUploads || !dbPath || !r2Path) {
      await Promise.all([
        deleteAlbumById(album.id),
        ...Object.entries(r2Path).map(async ([key, path]) => {
          const currentBuffer = buffer[key as "sm" | "md" | "lg"];
          if (currentBuffer) await deleteFileToBucket(currentBuffer, path);
        }),
      ]);
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
    return onThrowError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams.getAll("artists_id") as string | string[];
    if (!searchParams) {
      throw new CustomError({
        errors: [{ message: "Admin not found." }],
        msg: "Admin not found.",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }
    let albums = [];
    const newArtistsId = [...searchParams];

    albums = await prisma.album.findMany({
      where: {
        artists: {
          some: { artist_id: { in: newArtistsId } },
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
  } catch (error) {
    return onThrowError(error);
  }
}
