"use server";

import { ArtistFormData } from "@/types/apiTypes";
import { prisma } from "@config/db";

export const getArtists = async (limit?: number) => {
  const artists = await prisma.artist.findMany({
    ...(limit && { take: limit }),
    select: { id: true, name: true, avatar: true },
  });
  return artists;
};

export const countArtists = async () => {
  return await prisma.artist.count();
};

export const getArtistsByPagination = async ({ page, rows }: { page: number; rows: number }) => {
  return await prisma.artist.findMany({
    skip: (page - 1) * rows,
    take: rows,
    select: { name: true, id: true, avatar: true },
  });
};

export const artistIsExists = async ({ name, id }: { id?: string; name?: string }) => {
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
}) => {
  return await prisma.artist.update({
    where: {
      id,
    },
    data: {
      avatar: paths.avatar,
      main_cover: paths.mainCover,
      covers: paths.covers,
    },
  });
};

export const createArtist = async (body: ArtistFormData) => {
  const newArtist = await prisma.artist.create({
    data: {
      name: body.name,
      updated_at: new Date(),
      avatar: "",
      main_cover: "",
      description: body.description,
      is_verified: body.is_verified,
      listeners: body.listeners,
      followers_default: body.followers,
      socials: body.socials,
      regional_listeners: body.regional_listeners,
      covers: [],
    },
  });
  return newArtist;
};

export const updateArtistGenre = async ({
  artistId,
  genresId,
}: {
  artistId: string;
  genresId: string[];
}) => {
  const genres = await prisma.genre.findMany({
    where: { artists: { every: { id: artistId } } },
    select: { id: true },
  });

  const filteredGenres = genresId.filter((id) => {
    id !== genres.find((genre) => genre.id === id)?.id;
  });

  await prisma.artist.update({
    where: { id: artistId },
    data: {
      genres: {
        set: filteredGenres.map((id) => ({ id })),
      },
    },
  });
};

export const deleteArtistById = async (id: string) => {
  return await prisma.artist.delete({ where: { id } });
};
