"use server";
import {
  countTracks,
  deleteTrack,
  getRandomTracksIds,
  getTracks as getTracksRepo,
  getTracksByIds,
  getTracksByPagination,
  trackIsExists,
  updateTrackResourses,
  getTrackById,
} from "./track.repository";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { mapTrack } from "./track.mapper";
import { TrackWithRecommendations } from "@shared-types/track.types";
import { TrackFormData } from "@/types/form.types";
import { handleTrackResizeAndUpload, uploadSong } from "./track.storage";
import { GET_BUCKET_URL } from "@/shared/utils/constants";
import { deleteFileToBucket } from "../files";
import { prisma } from "@config/db";
import z from "zod";

const TRACKS_PER_PAGES = 6;

export const getTracksPaginationInfo = async ({
  artistName = "",
  albumName = "",
  trackName = "",
}: {
  artistName?: string;
  albumName?: string;
  trackName?: string;
}) => {
  const amount = await countTracks({ artistName, albumName, trackName });
  const pages = Math.ceil(amount / TRACKS_PER_PAGES);
  return { amount, pages };
};

export const getTracksByPaginationService = async ({
  page,
  rows,
  artistName = "",
  albumName = "",
  trackName = "",
}: {
  page: number;
  rows: number;
  artistName?: string;
  albumName?: string;
  trackName?: string;
}) => {
  return await getTracksByPagination({ page, rows, artistName, albumName, trackName });
};

export const deleteTrackById = async ({ id }: { id: string }) => {
  await deleteTrack(id);
};

export const getTracksByPage = async ({ page, rows }: { page: number; rows: number }) => {
  return await getTracksByPagination({ page, rows });
};

export const getTracksWithoutTrackById = async ({
  limit,
  trackId,
}: {
  limit: number;
  trackId: string;
}) => {
  const ids = await getRandomTracksIds(limit, [trackId]);
  return await getTracksByIds({ trackIds: ids.map(({ id }) => id) });
};

export const getTracksByRecomendations = async ({
  limit,
  excludeId,
}: {
  limit: number;
  excludeId: string[] | null;
}) => {
  const tracksIds = await getRandomTracksIds(limit, excludeId);
  const tracks = tracksIds.map(async ({ id }) => await getTrackById({ trackId: id }));
  return tracks;
};

export const getTrackWithRecommendationsService = async ({
  limit,
  trackIds,
}: {
  limit: number;
  trackIds: string[];
}): Promise<TrackWithRecommendations[]> => {
  const targetTrackIds = trackIds.slice(0, limit);

  const randomIdsResponses = await Promise.all(
    targetTrackIds.map((id) => getRandomTracksIds(5, [id])),
  );

  const recommendationsMap = targetTrackIds.reduce(
    (acc, id, i) => {
      acc[id] = randomIdsResponses[i].map((r) => r.id);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const allNeededIds = [
    ...new Set([...targetTrackIds, ...randomIdsResponses.flat().map((r) => r.id)]),
  ];

  const allTracksRaw = await getTracksRepo({
    limit: allNeededIds.length,
    ids: allNeededIds,
  });

  if (!allTracksRaw || allTracksRaw.length === 0) {
    throw new CustomError({
      errors: [{ message: "No tracks found for the given IDs." }],
      msg: "Tracks retrieval failed",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }

  return targetTrackIds
    .map((mainId) => {
      const mainTrack = allTracksRaw.find((t) => t.id === mainId);
      if (!mainTrack) return null;

      const recommendedIds = recommendationsMap[mainId] || [];
      const recommendedTracks = allTracksRaw
        .filter((t) => recommendedIds.includes(t.id))
        .map((t) => mapTrack(t));

      return {
        ...mapTrack(mainTrack),
        recommendedTracks,
      };
    })
    .filter(Boolean);
};

export const createTrack = async (body: TrackFormData) => {
  const isExists = await trackIsExists({ name: body.name });
  if (isExists) return null;

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
      return null;
    }

    return updatedTrack;
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
      return null;
    }
  }
  return updatedTrack;
};

export const getTracks = async (tracksId?: string | string[]) => {
  if (tracksId) {
    let tracks = [];
    const newArtistsId = [...tracksId];

    tracks = await prisma.track.findMany({
      where: {
        artists: {
          some: {
            id: { in: newArtistsId },
          },
        },
      },
    });

    if (tracks.length === 0) return null;
    return tracks;
  }

  const tracks = await prisma.track.findMany({
    select: { name: true, id: true, cover: true },
    orderBy: { name: "asc" },
  });
  return tracks;
};

export const updateTrack = async (body: TrackFormData) => {
  const track = await getTrackById({ trackId: body.id });
  if (!track) return null;
  const song_path = body.song && (await uploadSong(body.song, track.id));
  let updatedTrack: any = track;
  if (song_path) {
    updatedTrack = await updateTrackResourses({
      id: track.id,
      paths: { song: GET_BUCKET_URL && GET_BUCKET_URL + song_path },
    });
    if (!song_path || !updatedTrack) {
      await Promise.all([deleteTrack(track.id), deleteFileToBucket(body.song, song_path)]);
      return null;
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
      return null;
    }
  }
  if (body.artists.length > 0) {
    updatedTrack = await prisma.track.update({
      where: { id: body.id },
      data: { artists: { connect: body.artists.map((id) => ({ id })) } },
    });
  }
  return updatedTrack;
};

export const createTracksBulk = async (
  data: z.ZodSafeParseResult<{
    artistId: string;
    albumId: string;
    tracks: {
      name: string;
      releaseDate: string;
      duration: number;
      reproductions: number;
      genres: string[];
      order: number;
      disk: number;
    }[];
  }>,
) => {
  if (!data.success) {
    throw new CustomError({
      errors: data.error.issues,
      msg: "Invalid data format",
      httpStatusCode: HttpStatusCode.BAD_REQUEST,
    });
  }

  const { artistId, albumId, tracks } = data.data;

  const results = await prisma.$transaction(async (tx) => {
    const createdTracks = [];

    for (const track of tracks) {
      const existingTrack = await tx.track.findFirst({
        where: {
          name: track.name,
        },
      });

      if (existingTrack) {
        continue;
      }

      const albumCover = await tx.album.findFirst({
        where: { id: albumId },
        select: { cover: true },
      });

      const newTrack = await tx.track.create({
        data: {
          name: track.name,
          releaseDate: new Date(track.releaseDate),
          duration: track.duration,
          reproductions: track.reproductions,
          artists: {
            connect: [{ id: artistId }],
          },
          cover: albumCover?.cover || { sm: "", md: "", lg: "" },
          genres: {
            connectOrCreate: track.genres.map((genreName) => ({
              where: { name: genreName },
              create: { name: genreName },
            })),
          },
          albums: {
            create: {
              albumId: albumId,
              order: track.order,
              disk: track.disk,
            },
          },
        },
      });
      createdTracks.push(newTrack);
    }

    return createdTracks;
  });

  if (results.length === 0) return null;

  return results;
};
