"use server";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { mapAlbumsToContent, mapArtistsToContent, mapTrackToContent } from "./content.mapper";
import { ImageSizes } from "@/types/common.types";
import { getRandomTracksIds } from "../track/track.repository";
import {
  getAlbumsForContent,
  getArtistsForContent,
  getPlaylistsForContent,
  getTracksForContent,
  getUserPlaylistsForSelection,
} from "./content.repository";

export const getArtistsForDiscovery = async (
  limit: number,
): Promise<
  {
    type: string;
    name: string;
    id: string;
    avatar: ImageSizes | null;
  }[]
> => {
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

export const getAlbumsForDiscovery = async (
  limit: number,
): Promise<
  {
    type: string;
    name: string;
    id: string;
    cover: ImageSizes | null;
  }[]
> => {
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

export const getTracksForDiscovery = async (limit: number, userId?: string, filter?: any) => {
  const discoveryBaseIds = await getRandomTracksIds(
    limit,
    filter?.by === "tracks" ? filter.id : null,
  );
  const mainIds = discoveryBaseIds.map((t) => t.id);

  const recommendationsResponses = await Promise.all(
    mainIds.map((id) => getRandomTracksIds(5, id)),
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

  const userPlaylists = userId ? await getUserPlaylistsForSelection({ userId }) : null;

  return mainIds
    .map((id) => {
      const mainTrack = allTracksRaw.find((t) => t.id === id);
      if (!mainTrack) return null;

      const recommendedIds = recsMap[id] || [];
      const recommendedTracks = allTracksRaw
        .filter((t) => recommendedIds.includes(t.id))
        .map((t) => mapTrackToContent(t, userId, userPlaylists));

      return {
        ...mapTrackToContent(mainTrack, userId, userPlaylists),
        recommendedTracks,
      };
    })
    .filter(Boolean);
};

export const getContent = async ({
  type = ["tracks"],
  limit = 10,
  filter = "none",
  filterId = "",
  idToRemove,
  userId = "",
}: {
  type?: string[];
  limit?: number;
  filter?: "artists" | "tracks" | "albums" | "playlists" | "none";
  filterId?: string;
  idToRemove?: string;
  userId?: string;
}) => {
  let elements: any[] = [];
  if (type.includes("tracks")) {
    const tracksData = await getTracksForDiscovery(limit, userId, { by: filter, id: filterId });

    const newTracks = await Promise.all(
      tracksData.map(async (track: any) => ({
        tracks: await getTracksForDiscovery(5, userId, { by: "tracks", id: track.id }),
        ...track,
      })),
    );
    elements = elements.concat(newTracks);
  }
  if (type.includes("albums")) elements = elements.concat(await getAlbumsForDiscovery(limit));
  if (type.includes("artists")) elements = elements.concat(await getArtistsForDiscovery(limit));
  if (type.includes("playlists")) elements = elements.concat(await getPlaylistsForContent(limit));

  if (!elements.length) {
    throw new CustomError({
      errors: [{ message: "The search returned no results. No elements were found." }],
      msg: "The search returned no results. No elements were found.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }

  if (idToRemove) {
    elements = elements.filter((e: any) => e.id !== idToRemove);
  }
  return elements.sort(() => Math.random() - 0.5).slice(0, limit);
};
