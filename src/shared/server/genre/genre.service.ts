"use server";
import { CustomError } from "@shared-types/error.type";
import { countGenres, deleteGenre, getGenreDistributionFromDB } from "./genre.repository";
import { HttpStatusCode } from "@shared-types/httpStatusCode";

const GENRES_PER_PAGES = 6;

export const getGenresPaginationInfo = async (): Promise<{
  amount: number;
  pages: number;
}> => {
  const amount = await countGenres();
  const pages = Math.ceil(amount / GENRES_PER_PAGES);
  return { amount, pages };
};
export const deleteGenreById = async ({ id }: { id: string }) => {
  const genreDeleted = await deleteGenre({ id });
  if (!genreDeleted) {
    throw new CustomError({
      errors: [{ message: `Could not delete album. No album found with ID: ${id}` }],
      msg: "Deletion failed: Album not found.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }
};
export async function getGenreDistribution() {
  const genres = await getGenreDistributionFromDB();
  const sorted = [...genres].sort((a, b) => b._count.tracks - a._count.tracks).slice(0, 8);
  const maxTracks = sorted[0]?._count.tracks ?? 1;
  return sorted.map((g) => ({
    id: g.id,
    name: g.name,
    tracks: g._count.tracks,
    percentage: Math.round((g._count.tracks / maxTracks) * 100),
  }));
}
