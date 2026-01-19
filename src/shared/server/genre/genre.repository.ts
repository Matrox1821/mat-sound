"use server";

import { prisma } from "@config/db";

export const getGenres = async (): Promise<
  {
    name: string;
    id: string;
  }[]
> => {
  const genres = await prisma.genre.findMany({
    select: { id: true, name: true },
  });
  return genres;
};

export const countGenres = async (): Promise<number> => {
  return await prisma.genre.count();
};

export const getGenresByPagination = async ({
  page,
  rows,
}: {
  page: number;
  rows: number;
}): Promise<
  {
    id: string;
    name: string;
  }[]
> => {
  return await prisma.genre.findMany({
    skip: (page - 1) * rows,
    take: rows,
    select: { name: true, id: true },
  });
};

export const genreIsExist = async (genre: string): Promise<boolean> => {
  const isExist = await prisma.genre.findFirst({ where: { name: genre } });
  return !!isExist;
};

export const createGenre = async (
  genre: string
): Promise<{
  id: string;
  name: string;
}> => {
  return await prisma.genre.create({
    data: {
      name: genre,
    },
    select: { id: true, name: true },
  });
};

export const deleteGenre = async ({
  id,
}: {
  id: string;
}): Promise<{
  id: string;
  name: string;
}> => {
  return prisma.genre.delete({ where: { id }, select: { id: true, name: true } });
};
