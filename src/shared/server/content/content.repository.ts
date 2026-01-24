import { prisma } from "@config/db";
import { Prisma } from "../../../../generated/prisma/client";
import { ArtistBase } from "@/types/artist.types";
import {
  AlbumContentRepository,
  TrackContentRepository,
  PlaylistContentRepository,
} from "@/types/content.types";

export const getAlbumsForContent = async (
  limit: number,
  find?: { by: "artists" | "tracks" | "albums" | "playlists" | "none"; id?: string },
): Promise<AlbumContentRepository[]> => {
  const filters: Record<string, Prisma.AlbumWhereInput> = {
    artist: { artists: { some: { id: find?.id } } },
    track: { tracks: { some: { track: { id: find?.id } } } },
  };
  const where = find?.by && filters[find.by] && find?.id ? filters[find.by] : {};
  const albums = await prisma.album.findMany({
    take: limit,
    where,
    select: {
      id: true,
      name: true,
      cover: true,
      artists: {
        select: { id: true, avatar: true, name: true },
      },
    },
  });
  return albums as unknown as AlbumContentRepository[];
};

export const getArtistsForContent = async (limit?: number): Promise<ArtistBase[]> => {
  return (await prisma.artist.findMany({
    ...(limit && { take: limit }),
    select: { id: true, name: true, avatar: true },
  })) as unknown as ArtistBase[];
};

export const getPlaylistsForContent = async (
  limit: number,
): Promise<PlaylistContentRepository[]> => {
  return (await prisma.playlist.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      cover: true,
      tracks: { select: { track: { select: { cover: true, id: true, name: true } } }, take: 4 },
    },
  })) as unknown as PlaylistContentRepository[];
};

export const getTracksForContent = async ({
  limit,
  ids,
}: {
  limit: number;
  ids: string[];
  userId?: string;
}): Promise<TrackContentRepository[]> => {
  return (await prisma.track.findMany({
    take: limit,
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      cover: true,
      song: true,
      duration: true,
      reproductions: true,
      releaseDate: true,
      lyrics: true,
      _count: { select: { likes: true } },
      artists: {
        select: { name: true, id: true, avatar: true },
      },
      albums: {
        select: { order: true, disk: true, album: { select: { id: true, name: true } } },
      },
    },
  })) as unknown as TrackContentRepository[];
};
