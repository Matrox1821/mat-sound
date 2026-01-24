"use server";
import { CustomError } from "@/types/error.type";
import { countGenres, deleteGenre } from "./genre.repository";
import { HttpStatusCode } from "@/types/httpStatusCode";

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
