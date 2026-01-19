import { prisma } from "@config/db";
import { Prisma } from "../../../../generated/prisma/client";
import { AlbumById, AlbumByPagination, type AlbumWithArtists } from "@/types/album.types";
import { mapAlbumDetails } from "./album.mapper";
import { ImageSizes } from "@/types/common.types";
import { AlbumFormData } from "@/types/form.types";

export const getAlbumById = async (id: string): Promise<AlbumById> => {
  const response = await prisma.album.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      cover: true,
      releaseDate: true,
      artists: {
        select: {
          id: true,
          avatar: true,
          name: true,
        },
      },
      _count: { select: { tracks: true } },
      tracks: {
        select: {
          order: true,
          disk: true,
          track: {
            select: {
              artists: {
                select: {
                  name: true,
                  id: true,
                  avatar: true,
                },
              },
              albums: {
                select: { album: { select: { name: true, id: true } } },
              },
              lyrics: true,
              reproductions: true,
              duration: true,
              name: true,
              song: true,
              id: true,
              cover: true,
            },
          },
        },
      },
    },
  });
  return mapAlbumDetails(response);
};

export const getAlbums = async (
  limit: number,
  find?: { by: "artist" | "track"; id: string },
): Promise<AlbumWithArtists[]> => {
  const filters: Record<string, Prisma.AlbumWhereInput> = {
    artist: { artists: { some: { id: find?.id } } },
    track: { tracks: { some: { track: { id: find?.id } } } },
  };
  const where = find?.by ? filters[find.by] : {};
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

export const countAlbums = async ({
  artistName = "",
  albumName = "",
}: {
  artistName?: string;
  albumName?: string;
}): Promise<number> => {
  return await prisma.album.count({
    where: {
      ...(albumName !== "" && {
        name: {
          contains: albumName,
          mode: "insensitive",
        },
      }),
      ...(artistName !== "" && {
        artists: { some: { name: { contains: artistName, mode: "insensitive" } } },
      }),
    },
  });
};

export const deleteAlbum = async (
  id: string,
): Promise<{
  name: string;
  id: string;
}> => {
  return await prisma.album.delete({ where: { id }, select: { id: true, name: true } });
};

export const getAlbumsByPagination = async ({
  page,
  rows,
  artistName = "",
  albumName = "",
}: {
  page: number;
  rows: number;
  artistName?: string;
  albumName?: string;
}): Promise<AlbumByPagination[]> => {
  return (await prisma.album.findMany({
    where: {
      ...(albumName !== "" && {
        name: {
          contains: albumName,
          mode: "insensitive",
        },
      }),
      ...(artistName !== "" && {
        artists: { some: { name: { contains: artistName, mode: "insensitive" } } },
      }),
    },
    skip: (page - 1) * rows,
    take: rows,
    select: {
      name: true,
      id: true,
      cover: true,
      artists: { select: { id: true, name: true, avatar: true } },
      releaseDate: true,
      tracks: {
        select: {
          disk: true,
          order: true,
          track: { select: { id: true, name: true, cover: true } },
        },
      },
    },
  })) as unknown as AlbumByPagination[];
};

export const albumIsExists = async ({
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

  const isExists = await prisma.album.findFirst({ where });
  return !!isExists;
};

export const createAlbum = async (
  body: AlbumFormData,
): Promise<{
  name: string;
  id: string;
}> => {
  const newAlbum = await prisma.album.create({
    data: {
      name: body.name,
      releaseDate: new Date(body.releaseDate),
      artists: body.artists && { connect: body.artists?.map((id: string) => ({ id })) },
    },
    select: {
      id: true,
      name: true,
    },
  });
  return newAlbum;
};

export const updateAlbumCover = async ({
  albumId,
  paths,
}: {
  albumId: string;
  paths: { sm: string; md: string; lg: string } | null;
}): Promise<{
  id: string;
  cover: ImageSizes;
}> => {
  const updatedAlbum = await prisma.album.update({
    where: {
      id: albumId,
    },
    data: {
      cover: paths || { sm: "", md: "", lg: "" },
    },
    select: { id: true, cover: true },
  });

  return updatedAlbum as unknown as {
    id: string;
    cover: ImageSizes;
  };
};

export const updateAlbumGenre = async ({
  albumId,
  genresId,
}: {
  albumId: string;
  genresId: string[];
}): Promise<{
  id: string;
  genres: {
    name: string;
    id: string;
    addedAt: Date;
  }[];
}> => {
  const genresInAlbum = await prisma.album.findMany({
    where: { id: albumId },
    select: { genres: { select: { id: true } } },
  });

  const genreIds = genresInAlbum.flatMap((item) => item.genres.map((g) => g.id));
  const filteredGenres = genresId.filter((id) => id !== genreIds.find((genre) => genre === id));

  return await prisma.album.update({
    where: { id: albumId },
    data: {
      genres: {
        set: filteredGenres.map((id) => ({ id })),
      },
    },
    select: { id: true, genres: true },
  });
};

export const deleteAlbumById = async (id: string): Promise<{ name: string; id: string }> => {
  return await prisma.$transaction(async (tx) => {
    const tracksInAlbum = await tx.trackOnAlbum.findMany({
      where: { albumId: id },
      select: { trackId: true },
    });

    const trackIds = tracksInAlbum.map((t) => t.trackId);

    await tx.trackOnAlbum.deleteMany({
      where: { albumId: id },
    });

    const orphans = await tx.track.findMany({
      where: {
        id: { in: trackIds },
        albums: { none: {} },
      },
      select: { id: true },
    });

    const orphanIds = orphans.map((o) => o.id);

    if (orphanIds.length > 0) {
      await tx.track.deleteMany({
        where: { id: { in: orphanIds } },
      });
    }

    return await tx.album.delete({
      where: { id },
      select: { id: true, name: true },
    });
  });
};
