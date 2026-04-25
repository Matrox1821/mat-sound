"use server";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import {
  mapTrackToMediaCard,
  mapAlbumRawToMediaCard,
  mapArtistRawToMediaCard,
  mapPlaylistRawToMediaCard,
} from "./content.mapper";
import {
  getRandomTracksIds,
  getAlbumsForContent,
  getArtistsForContent,
  getPlaylistsForContent,
  getTracksForContent,
} from "./content.repository";
import { MediaCard, TrackCard } from "@shared-types/content.types";

const getTracksForDiscovery = async (
  limit: number,
  filter?: { by: string; id: string | null },
): Promise<TrackCard[]> => {
  const baseIds = await getRandomTracksIds(
    limit,
    filter?.by === "tracks" && filter.id ? [filter.id] : null,
  );
  const mainIds = baseIds.map((t) => t.id);

  const recommendationResults = await Promise.all(mainIds.map((id) => getRandomTracksIds(5, [id])));

  const allIds = [...new Set([...mainIds, ...recommendationResults.flat().map((r) => r.id)])];
  const allTracks = await getTracksForContent(allIds);

  if (!allTracks.length) {
    throw new CustomError({
      msg: "Could not populate discovery section.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }

  const trackMap = new Map(allTracks.map((t) => [t.id, t]));

  return mainIds
    .map((id) => {
      const main = trackMap.get(id);
      if (!main) return null;

      return mapTrackToMediaCard(main);
    })
    .filter((t): t is TrackCard => t !== null);
};

export const getContent = async ({
  type = ["tracks"],
  limit = 10,
  filter = "none",
  filterId,
  idToRemove,
}: {
  type?: string[];
  limit?: number;
  filter?: "artists" | "tracks" | "albums" | "playlists" | "none";
  filterId?: string;
  idToRemove?: string;
}): Promise<MediaCard[]> => {
  const promises: Promise<MediaCard[]>[] = [];

  if (type.includes("tracks")) {
    promises.push(getTracksForDiscovery(limit, { by: filter, id: filterId ?? null }));
  }
  if (type.includes("albums")) {
    promises.push(getAlbumsForContent(limit).then((data) => data.map(mapAlbumRawToMediaCard)));
  }
  if (type.includes("artists")) {
    promises.push(getArtistsForContent(limit).then((data) => data.map(mapArtistRawToMediaCard)));
  }
  if (type.includes("playlists")) {
    promises.push(
      getPlaylistsForContent(limit).then((data) =>
        data.map((newData) => mapPlaylistRawToMediaCard(newData)),
      ),
    );
  }

  const results = await Promise.all(promises);
  let elements = results.flat();

  if (elements.length === 0) {
    throw new CustomError({
      errors: [{ message: "The search returned no results." }],
      msg: "The search returned no results.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }

  if (idToRemove) {
    elements = elements.filter((e) => e.id !== idToRemove);
  }

  for (let i = elements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [elements[i], elements[j]] = [elements[j], elements[i]];
  }

  return elements.slice(0, limit);
};
