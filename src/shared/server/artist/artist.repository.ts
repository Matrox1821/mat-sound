"use server";

import { ArtistByPagination } from "@/types/artist.types";
import { ImageSizes } from "@/types/common.types";
import { ArtistFormData } from "@/types/form.types";
import { prisma } from "@config/db";

export const getArtists = async (
  limit?: number,
): Promise<
  {
    name: string;
    id: string;
    avatar: ImageSizes;
  }[]
> => {
  const artists = await prisma.artist.findMany({
    ...(limit && { take: limit }),
    select: { id: true, name: true, avatar: true },
  });
  return artists as unknown as {
    name: string;
    id: string;
    avatar: ImageSizes;
  }[];
};

export const countArtists = async ({ query = "" }: { query?: string }): Promise<number> => {
  return await prisma.artist.count({
    where: {
      ...(query !== "" && {
        name: {
          contains: query,
          mode: "insensitive",
        },
      }),
    },
  });
};

export const getArtistsByPagination = async ({
  page,
  rows,
  query = "",
}: {
  page: number;
  rows: number;
  query?: string;
}): Promise<ArtistByPagination[]> => {
  return (await prisma.artist.findMany({
    where: {
      ...(query !== "" && {
        name: {
          contains: query,
          mode: "insensitive",
        },
      }),
    },
    skip: (page - 1) * rows,
    take: rows,
  })) as unknown as ArtistByPagination[];
};

export const artistIsExists = async ({
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

  const isExists = await prisma.artist.findFirst({ where });
  return !!isExists;
};

export const updateArtistImages = async ({
  id,
  paths,
}: {
  id: string;
  paths: {
    avatar: { sm: string; md: string; lg: string };
    mainCover: string;
    covers: string[];
  };
}): Promise<{
  name: string;
  id: string;
  avatar: ImageSizes;
  mainCover: string | null;
  covers: string[];
}> => {
  return (await prisma.artist.update({
    where: {
      id,
    },
    data: {
      avatar: paths.avatar,
      mainCover: paths.mainCover,
      covers: paths.covers,
    },
    select: { id: true, avatar: true, mainCover: true, covers: true, name: true },
  })) as unknown as {
    name: string;
    id: string;
    avatar: ImageSizes;
    mainCover: string | null;
    covers: string[];
  };
};

export const createArtist = async (body: ArtistFormData) => {
  const newArtist = await prisma.artist.create({
    data: {
      name: body.name,
      updatedAt: new Date(),
      avatar: "",
      mainCover: "",
      description: body.description,
      isVerified: body.isVerified,
      listeners: body.listeners,
      followersDefault: body.followers,
      socials: body.socials,
      regionalListeners: body.regionalListeners,
      covers: [],
    },
    select: { id: true, name: true },
  });
  return newArtist;
};

export const updateArtistGenre = async ({
  artistId,
  genresId,
}: {
  artistId: string;
  genresId: string[];
}): Promise<{
  id: string;
  genres: {
    name: string;
    id: string;
    addedAt: Date;
  }[];
}> => {
  const genres = await prisma.genre.findMany({
    where: { artists: { every: { id: artistId } } },
    select: { id: true },
  });

  const filteredGenres = genresId.filter((id) => {
    return id !== genres.find((genre) => genre.id === id)?.id;
  });

  return await prisma.artist.update({
    where: { id: artistId },
    data: {
      genres: {
        set: filteredGenres.map((id) => ({ id })),
      },
    },
    select: { id: true, genres: true },
  });
};

export const deleteArtistById = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const albumsToDelete = await tx.album.findMany({
      where: {
        artists: { some: { id } },
      },
      include: {
        _count: { select: { artists: true } },
      },
    });

    const solitaryAlbumIds = albumsToDelete
      .filter((album) => album._count.artists === 1)
      .map((album) => album.id);

    const tracksToDelete = await tx.track.findMany({
      where: {
        artists: { some: { id } },
      },
      include: {
        _count: { select: { artists: true } },
      },
    });

    const solitaryTrackIds = tracksToDelete
      .filter((track) => track._count.artists === 1)
      .map((track) => track.id);

    if (solitaryTrackIds.length > 0) {
      await tx.track.deleteMany({
        where: { id: { in: solitaryTrackIds } },
      });
    }

    if (solitaryAlbumIds.length > 0) {
      await tx.album.deleteMany({
        where: { id: { in: solitaryAlbumIds } },
      });
    }

    return await tx.artist.delete({
      where: { id },
      select: { id: true, name: true },
    });
  });
};
