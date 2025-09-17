import { onSuccessRequest, onThrowError } from "@/apiService";
import prisma from "@/config/db";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { deleteFileToBucket, uploadFileToBucket } from "@/shared/files";
import { createAlbumInDatabase } from "@/shared/database";
import { formatR2FilePath } from "@/shared/helpers";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const artists = JSON.parse(formData.get("artists") as string) as {
      name: string;
    }[];
    const cover_path = formatR2FilePath({
      type: "albumCover",
      albumName: name,
      root: "artists",
      artistName: artists[0].name,
    });
    const body = {
      name: formData.get("name") as string,
      image: formData.get("image") as File,
      release_date: formData.get("release_date") as string,
      copyright: JSON.parse(formData.get("copyright") as string) as string[],
      tracks_in_order: JSON.parse(formData.get("tracks_in_order") as string) as {
        [key: string]: string;
      }[],
      artists,
      cover_path,
    };
    const coverCreated = await uploadFileToBucket(body.image, cover_path);

    if (!coverCreated) {
      await deleteFileToBucket(body.image, cover_path);

      throw new CustomError({
        errors: [{ message: "Album cover was not created." }],
        msg: "Album cover was not created.",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });
    }

    const existAlbum = await prisma.album.findFirst({
      where: { name: body.name },
    });

    if (existAlbum)
      throw new CustomError({
        errors: [{ message: "Album already exists." }],
        msg: "Album already exists.",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });

    const newAlbum = await createAlbumInDatabase(body);

    return onSuccessRequest({
      httpStatusCode: 200,
      data: { artist: newAlbum },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams.get("artists_id") as string | string[];

    if (!searchParams) {
      throw new CustomError({
        errors: [{ message: "Admin not found." }],
        msg: "Admin not found.",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }
    let albums = [];
    if (searchParams instanceof Array) {
      const newArtistsId = [...searchParams];
      const artists_id_obj = newArtistsId.map((id) => {
        return {
          artist_id: id,
        };
      });
      albums = await prisma.album.findMany({
        where: {
          AND: artists_id_obj,
        },
      });
    } else {
      const artists_id = searchParams;

      albums = await prisma.album.findMany({
        where: { artist: { id: artists_id } },
      });
    }
    if (albums.length === 0) {
      throw new CustomError({
        errors: [{ message: "Album not found." }],
        msg: "Album not found.",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }
    return onSuccessRequest({
      httpStatusCode: 200,
      data: { albums },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
