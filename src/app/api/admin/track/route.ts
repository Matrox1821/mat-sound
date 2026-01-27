import { onSuccessRequest, onThrowError } from "@/apiService";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { NextRequest } from "next/server";
import { deleteFileToBucket } from "@/shared/server/files";
import { parseTrackFormData, parseUpdatedTrackFormData } from "@/shared/formData/trackForm";
import {
  createTrack,
  deleteTrack,
  getTrackById,
  trackIsExists,
  updateTrackResourses,
} from "@/shared/server/track/track.repository";
import { handleTrackResizeAndUpload, uploadSong } from "@/shared/server/track/track.storage";
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
    const song_path = body.song && (await uploadSong(body.song, newTrack.id));

    let updatedTrack: any = newTrack;
    if (song_path) {
      updatedTrack = await updateTrackResourses({
        id: newTrack.id,
        paths: { song: GET_BUCKET_URL + song_path },
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
    if (body.cover) {
      const { buffer, dbPath, r2Path, trackUploads } = await handleTrackResizeAndUpload(
        body.cover,
        newTrack.id,
      );

      updatedTrack = await updateTrackResourses({
        id: newTrack.id,
        paths: { cover: dbPath, song: GET_BUCKET_URL ? GET_BUCKET_URL + r2Path : "" },
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
    const searchParams = req.nextUrl.searchParams.getAll("artists_id") as string | string[];

    if (searchParams) {
      let tracks = [];
      const newArtistsId = [...searchParams];

      tracks = await prisma.track.findMany({
        where: {
          artists: {
            some: {
              id: { in: newArtistsId },
            },
          },
        },
      });

      if (tracks.length === 0) {
        throw new CustomError({
          errors: [{ message: "Album not found." }],
          msg: "Album not found.",
          httpStatusCode: HttpStatusCode.NOT_FOUND,
        });
      }
      return onSuccessRequest({
        httpStatusCode: 200,
        data: tracks,
      });
    }

    const tracks = await prisma.track.findMany({
      select: { name: true, id: true, cover: true },
      orderBy: { name: "asc" },
    });
    return onSuccessRequest({
      httpStatusCode: 200,
      data: tracks,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = parseUpdatedTrackFormData(formData);

    const track = await getTrackById({ trackId: body.id });
    if (!track)
      throw new CustomError({
        errors: [{ message: "Track already exists." }],
        msg: "Track already exists.",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });

    const song_path = body.song && (await uploadSong(body.song, track.id));
    let updatedTrack: any = track;
    if (song_path) {
      updatedTrack = await updateTrackResourses({
        id: track.id,
        paths: { song: GET_BUCKET_URL && GET_BUCKET_URL + song_path },
      });
      if (!song_path || !updatedTrack) {
        await Promise.all([deleteTrack(track.id), deleteFileToBucket(body.song, song_path)]);
        throw new CustomError({
          errors: [{ message: "The track has not been updated" }],
          msg: "The track has not been updated",
          httpStatusCode: HttpStatusCode.CONFLICT,
        });
      }
    }
    if (body.cover) {
      const { buffer, dbPath, r2Path, trackUploads } = await handleTrackResizeAndUpload(
        body.cover,
        track.id,
      );

      updatedTrack = await updateTrackResourses({
        id: track.id,
        paths: { cover: dbPath, song: GET_BUCKET_URL ? GET_BUCKET_URL + r2Path : "" },
      });
      if (!buffer || !dbPath || !r2Path || !trackUploads || !song_path || !updatedTrack) {
        await Promise.all([
          deleteTrack(track.id),
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
    }
    return onSuccessRequest({
      httpStatusCode: 200,
      data: updatedTrack,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
