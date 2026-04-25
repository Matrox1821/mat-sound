"use server";
import { prisma } from "@config/db";
import { Prisma } from "../../../../generated/prisma/client";
import { TrackFull, trackFullSelect } from "../track/track.select";
import {
  albumContentSelect,
  playlistContentSelect,
  artistContentSelect,
  AlbumContentRaw,
  PlaylistContentRaw,
  ArtistContentRaw,
} from "./content.select";

export const getTracksForContent = async (ids: string[]): Promise<TrackFull[]> => {
  return prisma.track.findMany({
    where: { id: { in: ids } },
    select: trackFullSelect,
  });
};

export const getRandomTracksIds = async (
  limit: number,
  excludeIds: string[] | null,
): Promise<{ id: string }[]> => {
  const exclude = excludeIds ?? [];
  const excludeCondition =
    exclude.length > 0
      ? Prisma.sql`AND id NOT IN (SELECT unnest(${exclude}::uuid[]))`
      : Prisma.empty;

  return prisma.$queryRaw<{ id: string }[]>`
    SELECT id
    FROM track
    WHERE song IS NOT NULL
    AND song <> ''
    ${excludeCondition}
    ORDER BY RANDOM()
    LIMIT ${limit};
  `;
};

export const getAlbumsForContent = async (
  limit: number,
  filter?: { by: "artist" | "track"; id: string },
): Promise<AlbumContentRaw[]> => {
  const filterMap: Record<string, Prisma.AlbumWhereInput> = {
    artist: { artists: { some: { id: filter?.id } } },
    track: { tracks: { some: { track: { id: filter?.id } } } },
  };
  const where = filter ? (filterMap[filter.by] ?? {}) : {};

  return prisma.album.findMany({
    take: limit,
    where,
    select: albumContentSelect,
  });
};

export const getArtistsForContent = async (limit?: number): Promise<ArtistContentRaw[]> => {
  return prisma.artist.findMany({
    ...(limit !== undefined && { take: limit }),
    select: artistContentSelect,
  });
};

export const getPlaylistsForContent = async (limit: number): Promise<PlaylistContentRaw[]> => {
  return prisma.playlist.findMany({
    take: limit,
    select: playlistContentSelect,
  });
};
