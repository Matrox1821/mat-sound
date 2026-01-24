"use server";
import { CustomError } from "@/types/error.type";
import { HttpStatusCode } from "@/types/httpStatusCode";
import {
  mapAlbumsToContent,
  mapArtistsToContent,
  mapPlaylistToContent,
  mapTrackToContent,
} from "./content.mapper";
import { getRandomTracksIds } from "../track/track.repository";
import {
  getAlbumsForContent,
  getArtistsForContent,
  getPlaylistsForContent,
  getTracksForContent,
} from "./content.repository";
import {
  ContentElement,
  ContentTrack,
  AlbumContentService,
  ArtistContentService,
} from "@/types/content.types";

export const getArtistsForDiscovery = async (limit: number): Promise<ArtistContentService[]> => {
  const artists = await getArtistsForContent(limit);
  if (!artists || artists.length === 0) {
    throw new CustomError({
      errors: [
        {
          message: "No artists were found to display in the content section.",
        },
      ],
      msg: "Empty artist list",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }
  return mapArtistsToContent(artists);
};

export const getAlbumsForDiscovery = async (limit: number): Promise<AlbumContentService[]> => {
  const albums = await getAlbumsForContent(limit);
  if (!albums || albums.length === 0) {
    throw new CustomError({
      errors: [
        {
          message: "No albums were found to display in the content section.",
        },
      ],
      msg: "Empty album list",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }
  return mapAlbumsToContent(albums);
};

export const getTracksForDiscovery = async (
  limit: number,
  userId?: string,
  filter?: any,
): Promise<ContentTrack[] | null> => {
  const discoveryBaseIds = await getRandomTracksIds(
    limit,
    filter?.by === "tracks" ? filter.id : null,
  );
  const mainIds = discoveryBaseIds.map((t) => t.id);

  const recommendationsResponses = await Promise.all(
    mainIds.map((id) => getRandomTracksIds(5, [id])),
  );
  const recsMap = mainIds.reduce(
    (acc, id, i) => {
      acc[id] = recommendationsResponses[i].map((r) => r.id);
      return acc;
    },
    {} as Record<string, string[]>,
  );
  const allNeededIds = [
    ...new Set([...mainIds, ...recommendationsResponses.flat().map((r) => r.id)]),
  ];

  const allTracksRaw = await getTracksForContent({
    limit: allNeededIds.length,
    ids: allNeededIds,
    userId,
  });

  if (!allTracksRaw || allTracksRaw.length === 0) {
    throw new CustomError({
      msg: "Could not populate discovery section.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }

  const rawResults = mainIds.map((id) => {
    const mainTrack = allTracksRaw.find((t) => t.id === id);
    if (!mainTrack) return null;

    const recommendedIds = recsMap[id] || [];

    const recommendedTracks = allTracksRaw
      .filter((t) => recommendedIds.includes(t.id))
      .map((t) => mapTrackToContent(t));

    return {
      ...mapTrackToContent(mainTrack),
      recommendedTracks,
    } as ContentTrack;
  });

  return rawResults.filter((track): track is ContentTrack => track !== null);
};

export const getContent = async ({
  type = ["tracks"],
  limit = 10,
  filter = "none",
  filterId,
  idToRemove,
  userId,
}: {
  type?: string[];
  limit?: number;
  filter?: "artists" | "tracks" | "albums" | "playlists" | "none";
  filterId?: string;
  idToRemove?: string;
  userId?: string;
}): Promise<ContentElement[]> => {
  // 1. Creamos un array de promesas para ejecutar todas las fuentes en paralelo
  const promises: Promise<ContentElement[]>[] = [];

  if (type.includes("tracks")) {
    promises.push(
      getTracksForDiscovery(limit, userId, { by: filter, id: filterId }).then((data) => data ?? []),
    );
  }

  if (type.includes("albums")) {
    promises.push(getAlbumsForDiscovery(limit).then((data) => data ?? []));
  }

  if (type.includes("artists")) {
    promises.push(getArtistsForDiscovery(limit).then((data) => data ?? []));
  }

  if (type.includes("playlists")) {
    promises.push(getPlaylistsForContent(limit).then((data) => mapPlaylistToContent(data ?? [])));
  }

  // 2. Esperamos a que todas las fuentes respondan
  const results = await Promise.all(promises);
  let elements: ContentElement[] = results.flat();

  // 3. Validamos si hay resultados
  if (elements.length === 0) {
    throw new CustomError({
      errors: [{ message: "The search returned no results. No elements were found." }],
      msg: "The search returned no results. No elements were found.",
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
