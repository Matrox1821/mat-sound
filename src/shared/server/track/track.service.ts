"use server";
import {
  countTracks,
  deleteTrack,
  getRandomTracksIds,
  getTracks,
  getTracksByIds,
  getTracksByPagination,
} from "./track.repository";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { mapTrack } from "./track.mapper";
import { TrackWithRecommendations } from "@shared-types/track.types";

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

  const allTracksRaw = await getTracks({
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
