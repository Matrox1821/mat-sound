"use server";

import { prisma } from "@config/db";
import { updateArtistGenre } from "../artist/artist.repository";
import { updateAlbumGenre } from "../album/album.repository";
import { TrackById, TrackByPagination, TrackWithRelations } from "@/types/track.types";
import { ImageSizes } from "@/types/common.types";
import { TrackFormData } from "@/types/form.types";

export const getTracks = async ({
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

export async function getRandomTracksIds(
  limit = 5,
  excludeId: string | null,
): Promise<
  {
    id: string;
  }[]
> {
  if (excludeId) {
    return await prisma.$queryRaw<{ id: string }[]>`
      SELECT "id" 
      FROM "Track"
      WHERE "id" <> ${excludeId}
      ORDER BY RANDOM()
      LIMIT ${limit};
    `;
  }

  return await prisma.$queryRaw<{ id: string }[]>`
    SELECT "id"
    FROM "Track"
    ORDER BY RANDOM()
    LIMIT ${limit};
  `;
}

export const getTrackById = async ({
  trackId,
  userId = "",
}: {
  trackId: string;
  userId: string;
}): Promise<TrackById> => {
  return (await prisma.track.findUnique({
    where: {
      id: trackId,
    },
    select: {
      id: true,
      name: true,
      cover: true,
      releaseDate: true,
      artists: {
        select: { id: true, avatar: true, name: true },
      },
      duration: true,
      song: true,
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
      reproductions: true,
      lyrics: true,
      albums: {
        select: {
          album: {
            select: { id: true, cover: true, name: true },
          },
        },
      },
      genres: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })) as unknown as TrackById;
};

export const countTracks = async ({
  artistName = "",
  albumName = "",
  trackName = "",
}: {
  artistName?: string;
  albumName?: string;
  trackName?: string;
}): Promise<number> => {
  return await prisma.track.count({
    where: {
      ...(trackName !== "" && {
        name: {
          contains: trackName,
          mode: "insensitive",
        },
      }),
      ...(artistName !== "" && {
        artists: { some: { name: { contains: artistName, mode: "insensitive" } } },
      }),
      ...(albumName !== "" && {
        albums: {
          some: { album: { name: { contains: albumName, mode: "insensitive" } } },
        },
      }),
    },
  });
};

export const getTracksByPagination = async ({
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
}): Promise<TrackByPagination[]> => {
  return (await prisma.track.findMany({
    where: {
      ...(trackName !== "" && {
        name: {
          contains: trackName,
          mode: "insensitive",
        },
      }),
      ...(artistName !== "" && {
        artists: { some: { name: { contains: artistName, mode: "insensitive" } } },
      }),
      ...(albumName !== "" && {
        albums: {
          some: { album: { name: { contains: albumName, mode: "insensitive" } } },
        },
      }),
    },
    skip: (page - 1) * rows,
    take: rows,
    select: {
      name: true,
      id: true,
      cover: true,
      duration: true,
      genres: true,
      reproductions: true,
      releaseDate: true,
      lyrics: true,
      song: true,
      albums: {
        select: {
          disk: true,
          order: true,
          album: { select: { name: true, id: true, cover: true } },
        },
      },
      artists: { select: { id: true, name: true, avatar: true } },
    },
  })) as unknown as TrackByPagination[];
};

export const deleteTrack = async (
  id: string,
): Promise<{
  name: string;
  id: string;
}> => {
  return await prisma.track.delete({ where: { id }, select: { id: true, name: true } });
};

export const trackIsExists = async ({
  name,
  id,
}: {
  id?: string;
  name?: string;
}): Promise<boolean> => {
  const where: Record<string, any> = {};

  if (name) where.name = name;
  if (id) where.id = id;

  if (Object.keys(where).length === 0) return false;

  const isExists = await prisma.track.findFirst({ where });
  return !!isExists;
};

export const createTrack = async (body: TrackFormData): Promise<{ id: string; name: string }> => {
  const track = await prisma.track.create({
    data: {
      name: body.name,
      cover: { sm: "", md: "", lg: "" },
      song: "",
      releaseDate: new Date(body.releaseDate),
      duration: body.duration,
      reproductions: body.reproductions,
      lyrics: body.lyrics,
      artists: {
        connect: body.artists.map((artistId: string) => {
          return { id: artistId };
        }),
      },
      albums: {
        create: Object.entries(body.orderAndDisk).map(([albumId, { order, disk }]) => {
          return { albumId, order, disk };
        }),
      },
      genres: {
        connect: body.genres.map((genreId) => ({ id: genreId })),
      },
    },
    select: { id: true, name: true },
  });

  const album = await prisma.track.findFirst({
    where: { id: track.id },
    select: { albums: { select: { albumId: true } } },
  });
  const artist = await prisma.track.findFirst({
    where: { id: track.id },
    select: { artists: { select: { id: true } } },
  });
  if (track && album && artist)
    await Promise.all([
      ...album.albums.map(
        async ({ albumId }) => await updateAlbumGenre({ albumId, genresId: body.genres }),
      ),
      ...artist.artists.map(
        async (artist) => await updateArtistGenre({ artistId: artist.id, genresId: body.genres }),
      ),
    ]);

  return track;
};

export const updateTrackResourses = async ({
  id,
  paths,
}: {
  id: string;
  paths: {
    cover?: { sm: string; md: string; lg: string };
    song: string;
  };
}): Promise<{
  id: string;
  cover: ImageSizes;
  song: string;
}> => {
  return (await prisma.track.update({
    where: {
      id,
    },
    data: {
      song: paths.song,
      cover: paths.cover,
    },
  })) as unknown as {
    id: string;
    cover: ImageSizes;
    song: string;
  };
};
