"use server";

import { genreAdminApi } from "@/queryFn/admin/genreApi";

export async function createGenreServer(currentState: any, formData: FormData) {
  try {
    const genre = await genreAdminApi.createGenre(formData);

    if (genre.errors.length !== 0) return { errors: [genre.errors], success: false };

    return { success: true, errors: [] };
  } catch (error) {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
