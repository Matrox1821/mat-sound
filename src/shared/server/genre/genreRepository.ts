"use server";

import uuid from "@/shared/utils/uuid";
import { prisma } from "@config/db";

export const getGenres = async () => {
  const genres = await prisma.genre.findMany({
    select: { id: true, name: true },
  });
  return genres;
};

export const countGenres = async () => {
  return await prisma.genre.count();
};

export const getGenresByPagination = async ({ page, rows }: { page: number; rows: number }) => {
  return await prisma.genre.findMany({
    skip: (page - 1) * rows,
    take: rows,
    select: { name: true, id: true },
  });
};

export const genreIsExist = async (genre: string) => {
  const isExist = await prisma.genre.findFirst({ where: { name: genre } });
  return !!isExist;
};

export const createGenre = async (genre: string) => {
  return await prisma.genre.create({
    data: {
      id: uuid(),
      name: genre,
    },
  });
};

export const deleteGenre = async ({ id }: { id: string }) => {
  const genreDeleted = prisma.genre.delete({ where: { id } });
  return genreDeleted;
};
