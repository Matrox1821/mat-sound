import { onSuccessRequest, onThrowError } from "@/apiService";
import prisma from "@/config/db";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { deleteFileToBucket, uploadFileToBucket } from "@/shared/files";
import { createTrackInDatabase } from "@/shared/database";
import { formatR2FilePath } from "@/shared/helpers";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const artists = JSON.parse(formData.get("artists_id") as string) as {
      id: string;
      name: string;
    }[];

    const cover_path = formatR2FilePath({
      type: "trackCover",
      trackName: name,
      root: "artists",
      artistName: artists[0].name,
    });
    const song_path = formatR2FilePath({
      type: "trackSong",
      trackName: name,
      root: "artists",
      artistName: artists[0].name,
    });

    const body = {
      name: formData.get("name") as string,
      image: formData.get("image") as File,
      song: formData.get("song") as File,
      copyright: JSON.parse(formData.get("copyright") as string) as string[],
      release_date: formData.get("release_date") as string,
      duration: parseInt(formData.get("duration") as string),
      reproductions: parseInt(formData.get("reproductions") as string),
      albums_id: JSON.parse(formData.get("albums_id") as string) as string[],
      order_in_album: JSON.parse(formData.get("order_in_album") as string) as {
        [key: string]: string;
      }[],
      album_image: formData.get("album_image") as string,
      artists,
      cover_path,
      song_path,
    };

    if (body.image.name !== "") {
      const coverCreated = await uploadFileToBucket(body.image, cover_path);

      if (!coverCreated) {
        await deleteFileToBucket(body.image, cover_path);
        throw new CustomError({
          errors: [{ message: "Album cover was not created." }],
          msg: "Album cover was not created.",
          httpStatusCode: HttpStatusCode.CONFLICT,
        });
      }
    }
    const songCreated = await uploadFileToBucket(body.song, song_path);

    if (!songCreated) {
      await deleteFileToBucket(body.song, song_path);
      throw new CustomError({
        errors: [{ message: "Album cover was not created." }],
        msg: "Album cover was not created.",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });
    }

    const existTrack = await prisma.track.findFirst({
      where: { name: body.name },
    });

    if (existTrack)
      throw new CustomError({
        errors: [{ message: "Album already exists." }],
        msg: "Album already exists.",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });
    const newTrack = await createTrackInDatabase(body);

    return onSuccessRequest({
      httpStatusCode: 200,
      data: { track: newTrack },
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

    const artists_id = [...searchParams];

    const artistIds = artists_id.map((id) => {
      return {
        id,
      };
    });
    const albums = await prisma.album.findMany({
      where: {
        artist: { AND: artistIds },
      },
    });
    return onSuccessRequest({
      httpStatusCode: 200,
      data: { albums },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
