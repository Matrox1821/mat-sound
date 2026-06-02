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
import { ImageSizes } from "@/types/common.types";

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
  const where: Prisma.AlbumWhereInput = filter
    ? ({
        artist: { artists: { some: { id: filter.id } } },
        track: { tracks: { some: { track: { id: filter.id } } } },
      }[filter.by] ?? {})
    : {};

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
type RawActivityItem = {
  id: string;
  name: string;
  cover: ImageSizes;
  type: "artist" | "album" | "track";
  created_at: Date;
  extra: string | null;
};

export async function getRecentActivity() {
  return prisma.$queryRaw<RawActivityItem[]>(Prisma.sql`
    SELECT id, name, avatar AS cover, 'artist' AS type, created_at,
           listeners::text AS extra
    FROM artist

    UNION ALL

    SELECT a.id, a.name, a.cover, 'album' AS type, a.created_at,
           STRING_AGG(ar.name, ', ') AS extra
    FROM album a
    LEFT JOIN "_AlbumToArtist" aa ON aa."A" = a.id
    LEFT JOIN artist ar ON ar.id = aa."B"
    GROUP BY a.id, a.name, a.cover, a.created_at

    UNION ALL

    SELECT t.id, t.name, t.cover, 'track' AS type, t.created_at,
           STRING_AGG(ar.name, ', ') AS extra
    FROM track t
    LEFT JOIN "_ArtistToTrack" att ON att."B" = t.id
    LEFT JOIN artist ar ON ar.id = att."A"
    GROUP BY t.id, t.name, t.cover, t.created_at

    ORDER BY created_at DESC
    LIMIT 15
  `);
}
