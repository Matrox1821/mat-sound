"use server";
import {
  countTracks,
  deleteTrack,
  getRandomTracksIds,
  getTracksByIds,
  getTracksByPagination,
  trackIsExists,
  updateTrackResourses,
  getTrackById,
  getTrackCountsPerDay,
  getTopTracks,
  createTrackRepository,
} from "./track.repository";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { TrackFormData } from "@/types/form.types";
import { handleTrackResizeAndUpload, uploadSong } from "./track.storage";
import { GET_BUCKET_URL } from "@/shared/utils/constants";
import { deleteFileToBucket } from "../files";
import { prisma } from "@config/db";
import z from "zod";
import { ParsedTrackSearchParams } from "@/types/track.types";
import { ImageSizes } from "@/types/common.types";
import { requireAuthenticatedAction } from "../authGuard";
import { TrackBulkInput } from "@/shared/utils/schemas/bulkValidations";
import { uploadMP3InBucket } from "../uploadMP3InBucket";
import { formatR2FilePath } from "@/shared/utils/helpers";
import { uploadWebpToBucket } from "../uploadWebpToBucket";
import { getLyricsFromLrclib } from "../getLyrics";

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
  params,
}: {
  params: ParsedTrackSearchParams;
}) => {
  return await getTracksByPagination({ params });
};

export const deleteTrackById = async ({ id }: { id: string }) => {
  await deleteTrack(id);
};

export const getTracksByPage = async ({ params }: { params: ParsedTrackSearchParams }) => {
  return await getTracksByPagination({ params });
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

export const createTrack = async (body: TrackFormData) => {
  await requireAuthenticatedAction();
  const isExists = await trackIsExists({ name: body.name });
  if (isExists) return null;

  const newTrack = await createTrackRepository(body);
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
  }
  if (body.cover instanceof File) {
    const { buffer, dbPath, r2Path, trackUploads } = await handleTrackResizeAndUpload(
      body.cover,
      newTrack.id,
    );

    if (!buffer || !dbPath || !r2Path || !trackUploads) return null;

    await updateTrackResourses({
      id: newTrack.id,
      paths: { cover: dbPath },
    });
  } else {
    const album = await prisma.album.findFirst({
      where: { id: Object.keys(body.orderAndDisk)[0] },
      select: { cover: true },
    });
    await updateTrackResourses({
      id: newTrack.id,
      paths: { cover: album?.cover as ImageSizes | { sm: ""; md: ""; lg: "" } as ImageSizes },
    });
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
  await requireAuthenticatedAction();
  const track = await getTrackById({ trackId: body.id });
  if (!track) return null;
  let updatedTrack: any = track;
  if (body.song instanceof File) {
    const song_path = await uploadSong(body.song, track.id);
    if (!song_path) return null;

    await updateTrackResourses({
      id: track.id,
      paths: { song: GET_BUCKET_URL ? GET_BUCKET_URL + song_path : song_path },
    });
  }

  // 2. Subir cover si viene
  if (body.cover instanceof File) {
    const { buffer, dbPath, r2Path, trackUploads } = await handleTrackResizeAndUpload(
      body.cover,
      track.id,
    );

    if (!buffer || !dbPath || !r2Path || !trackUploads) return null;

    await updateTrackResourses({
      id: track.id,
      paths: { cover: dbPath },
    });
  }

  updatedTrack = await prisma.track.update({
    where: { id: body.id },
    data: {
      name: body.name,
      releaseDate: new Date(body.releaseDate),
      duration: body.duration,
      reproductions: body.reproductions,
      lyrics: body.lyrics ?? null,
      ...(body.artists.length > 0 && {
        artists: { set: body.artists.map((id) => ({ id })) },
      }),
      ...(body.genres.length > 0 && {
        genres: { set: body.genres.map((id) => ({ id })) },
      }),
      ...(body.orderAndDisk &&
        Object.entries(body.orderAndDisk).length > 0 && {
          albums: {
            upsert: Object.entries(body.orderAndDisk).map(([albumId, { order, disk }]) => ({
              where: {
                albumId_trackId: {
                  albumId,
                  trackId: body.id as string,
                },
              },
              update: { order, disk },
              create: { albumId, order, disk },
            })),
          },
        }),
    },
  });

  return updatedTrack;
};

export const createTracksBulk = async (
  data: z.ZodSafeParseResult<{
    artistId: string;
    albumId: string;
    tracks: TrackBulkInput[];
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
  const albumCover = await prisma.album.findFirst({
    where: { id: albumId },
    select: { cover: true },
  });

  const existingTrackNames = await prisma.track.findMany({
    where: {
      name: { in: tracks.map((t) => t.name) },
    },
    select: { name: true },
  });

  const existingNamesSet = new Set(existingTrackNames.map((t) => t.name));
  const newTracks = tracks.filter((t) => !existingNamesSet.has(t.name));

  if (newTracks.length === 0) return null;

  const uniqueGenres = [...new Set(newTracks.flatMap((track) => track.genres))];
  await Promise.all(
    uniqueGenres.map((genreName) =>
      prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: { name: genreName },
      }),
    ),
  );

  const results = await prisma.$transaction(
    async (tx) => {
      const createdTracks = await Promise.all(
        newTracks.map((track) =>
          tx.track.create({
            data: {
              name: track.name,
              releaseDate: new Date(track.releaseDate),
              duration: 0,
              reproductions: track.reproductions,
              artists: {
                connect: [{ id: artistId }],
              },
              cover: albumCover?.cover || { sm: "", md: "", lg: "" },
              genres: {
                connect: track.genres.map((genreName) => ({ name: genreName })),
              },
              albums: {
                create: {
                  albumId,
                  order: track.order,
                  disk: track.disk,
                },
              },
            },
            select: { id: true, name: true, artists: { select: { name: true } } },
          }),
        ),
      );

      return createdTracks;
    },
    { timeout: 15000 },
  );

  const uploadResults = await Promise.allSettled(
    results.map(async ({ id, name, artists }) => {
      const searchQuery = `${artists[0].name} - ${name}`;

      try {
        const { duration, route: songRoute } = await uploadMP3InBucket(
          searchQuery,
          formatR2FilePath({ type: "trackSong", id }),
        );

        const trackOriginalUrl = newTracks.find((t) => t.name === name)?.sourceUrl;

        let trackCoverPaths = null;
        if (trackOriginalUrl) {
          trackCoverPaths = await uploadWebpToBucket({
            archiveType: "trackCover",
            sourceUrl: trackOriginalUrl,
            id,
          });
        }

        const lyrics = await getLyricsFromLrclib({
          title: name,
          artist: artists[0].name,
        });

        await prisma.track.update({
          where: { id },
          data: {
            duration,
            song: songRoute,
            ...(trackCoverPaths ? { cover: trackCoverPaths } : {}),
            lyrics,
          },
        });

        console.log(`[Track] ✅ OK: "${name}" (${id})`);
      } catch (err) {
        console.error(`[Track] ❌ Falló "${name}" (${id}) — query: "${searchQuery}"`, err);
        throw new Error(
          `Error procesando track "${name}" (${id}): ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }),
  );

  const failed = uploadResults.filter((r) => r.status === "rejected") as PromiseRejectedResult[];

  if (failed.length > 0) {
    console.error(
      `[createTracksBulk] ${failed.length}/${results.length} tracks fallaron:`,
      failed.map((f) => f.reason?.message ?? f.reason),
    );
    throw new CustomError({
      errors: failed.map((f) => f.reason?.message ?? String(f.reason)),
      msg: `${failed.length} de ${results.length} tracks fallaron al procesar.`,
      httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }

  return results.length === 0 ? null : results;
};

export async function getTracksLast30Days() {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const rows = await getTrackCountsPerDay(since);

  const rowMap = new Map(rows.map((r) => [r.day, Number(r.count)]));
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    date.setHours(0, 0, 0, 0);

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return {
      day: date.getDate().toString(),
      month: date.toLocaleDateString("es-AR", { month: "long" }),
      monthIndex: date.getMonth(),
      tracks: rowMap.get(key) ?? 0,
    };
  });
}
export async function getTopTracksService() {
  const tracks = await getTopTracks();
  const max = tracks[0]?.reproductions ?? 1;
  return tracks.map((t: any) => ({
    ...t,
    cover: t.cover as { sm: string } | null,
    percentage: Math.round((t.reproductions / max) * 100),
  }));
}
