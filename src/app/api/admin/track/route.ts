import { onSuccessRequest, onThrowError } from "@/apiService";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { deleteFileToBucket } from "@/shared/server/files";
import { parseTrackFormData } from "@/shared/formData/trackForm";
import {
  createTrack,
  deleteTrack,
  trackIsExists,
  updateTrackResourses,
} from "@/shared/server/track/trackRepository";
import { handleTrackResizeAndUpload, uploadSong } from "@/shared/server/track/trackStorage";
import { GET_BUCKET_URL } from "@/shared/utils/constants";
import { prisma } from "@config/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = parseTrackFormData(formData);

    const isExists = await trackIsExists({ name: body.name });
    if (isExists)
      throw new CustomError({
        errors: [{ message: "Track already exists." }],
        msg: "Track already exists.",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });

    const newTrack = await createTrack(body);
    const song_path = await uploadSong(body.song, newTrack.id);

    if (!body.cover) {
      const updatedTrack = await updateTrackResourses({
        id: newTrack.id,
        paths: { song: GET_BUCKET_URL + song_path },
        albumId: Object.keys(body.order_and_disk)[0],
      });

      if (!song_path || !updatedTrack) {
        await Promise.all([deleteTrack(newTrack.id), deleteFileToBucket(body.song, song_path)]);
        throw new CustomError({
          errors: [{ message: "The track has not been updated" }],
          msg: "The track has not been updated",
          httpStatusCode: HttpStatusCode.CONFLICT,
        });
      }

      return onSuccessRequest({
        httpStatusCode: 200,
        data: updatedTrack,
      });
    }

    const { buffer, dbPath, r2Path, trackUploads } = await handleTrackResizeAndUpload(
      body.cover,
      newTrack.id
    );

    const updatedTrack = await updateTrackResourses({
      id: newTrack.id,
      paths: { cover: dbPath, song: GET_BUCKET_URL + song_path },
    });

    if (!buffer || !dbPath || !r2Path || !trackUploads || !song_path || !updatedTrack) {
      await Promise.all([
        deleteTrack(newTrack.id),
        ...Object.entries(r2Path).map(async ([key, path]) => {
          const currentBuffer = buffer[key as "sm" | "md" | "lg"];
          if (currentBuffer) await deleteFileToBucket(currentBuffer, path);
        }),
        deleteFileToBucket(body.song, song_path),
      ]);
      throw new CustomError({
        errors: [{ message: "The track has not been updated" }],
        msg: "The track has not been updated",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });
    }

    return onSuccessRequest({
      httpStatusCode: 200,
      data: updatedTrack,
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams.getAll("artists_id") as string[];
    if (searchParams.length === 0) {
      throw new CustomError({
        errors: [{ message: "Artists ID not provided." }],
        msg: "Artists ID not provided.",
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    const artists_id = [...searchParams];

    const tracks = await prisma.track.findMany({
      where: {
        artists: {
          some: {
            id: { in: artists_id },
          },
        },
      },
    });
    return onSuccessRequest({
      httpStatusCode: 200,
      data: tracks,
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
