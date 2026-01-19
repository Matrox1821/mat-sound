import { AlbumWithArtists } from "@/types/album.types";
import { prisma } from "@config/db";
import { Prisma } from "../../../../generated/prisma/client";
import { ImageSizes } from "@/types/common.types";
import { TrackWithRelations } from "@/types/track.types";
import { ArtistBase } from "@/types/artist.types";

export const getAlbumsForContent = async (
  limit: number,
  find?: { by: "artists" | "tracks" | "albums" | "playlists" | "none"; id?: string }
): Promise<AlbumWithArtists[]> => {
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
  return albums as unknown as AlbumWithArtists[];
};

export const getArtistsForContent = async (limit?: number): Promise<ArtistBase[]> => {
  return (await prisma.artist.findMany({
    ...(limit && { take: limit }),
    select: { id: true, name: true, avatar: true },
  })) as unknown as ArtistBase[];
};

export const getPlaylistsForContent = async (
  limit: number
): Promise<
  {
    type: string;
    id: string;
    name: string;
    cover: ImageSizes;
  }[]
> => {
  const playlists = await prisma.playlist.findMany({
    take: limit,
    select: { id: true, name: true, cover: true },
  });
  return playlists.map((playlist) => ({ ...playlist, type: "playlists" })) as unknown as {
    type: string;
    id: string;
    name: string;
    cover: ImageSizes;
  }[];
};

export const getTracksForContent = async ({
  limit,
  ids,
  userId,
}: {
  limit: number;
  ids: string[];
  userId?: string;
}): Promise<TrackWithRelations[]> => {
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
      collections: true,
      playlists: true,

      likes: userId
        ? {
            where: {
              userId: userId,
            },
            select: {
              userId: true,
            },
            take: 1,
          }
        : false,

      _count: { select: { likes: true } },
      artists: {
        select: { name: true, id: true, avatar: true },
      },
      albums: {
        select: { order: true, disk: true, album: { select: { id: true, name: true } } },
      },
    },
  })) as unknown as TrackWithRelations[];
};

export const getUserPlaylistsForSelection = async ({ userId = "" }: { userId: string }) => {
  if (userId === "") return;

  const response = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      playlists: {
        select: {
          id: true,
          name: true,
          cover: true,
          tracks: { select: { track: { select: { id: true, cover: true } } } },
        },
      },
    },
  });
  return response;
};
