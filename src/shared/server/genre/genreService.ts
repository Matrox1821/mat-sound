import { redirect } from "next/navigation";
import { countGenres, deleteGenre } from "../genre/genreRepository";

const GENRES_PER_PAGES = 6;

export const getGenresPaginationInfo = async () => {
  const amount = await countGenres();
  const pages = Math.ceil(amount / GENRES_PER_PAGES);
  return { amount, pages };
};
export const deleteGenreById = async ({ id }: { id: string }) => {
  const deleted = await deleteGenre({ id });
  /*  if (!deleted) {
    throw new CustomError("El género no existe o ya fue eliminado", 404);
  } */
};
