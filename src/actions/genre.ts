"use server";

import { createGenre, genreIsExist } from "@/shared/server/genre/genre.repository";
import { deleteGenreById } from "@/shared/server/genre/genre.service";
import { revalidatePath } from "next/cache";

export async function createGenreServer(currentState: any, formData: FormData) {
  try {
    const genres = [formData.getAll("genre") as string[]].flat();
    const parsedGenres = [...new Set(genres)];
    const genre = parsedGenres.map(async (genre) => {
      const genreLowerCase = genre.toLocaleLowerCase();
      const isExist = await genreIsExist(genreLowerCase);

      if (!isExist && genreLowerCase !== "") return await createGenre(genreLowerCase);
    });

    if (!genre) throw new Error();

    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
export async function deleteGenreServer(id: string) {
  try {
    await deleteGenreById({ id });

    revalidatePath("/admin/genres");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.errors?.[0]?.message || "Error al eliminar el género",
    };
  }
}
