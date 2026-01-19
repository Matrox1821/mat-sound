"use server";

import { genreAdminApi } from "@/queryFn/admin/genreApi";
import { deleteGenreById } from "@/shared/server/genre/genre.service";
import { revalidatePath } from "next/cache";

export async function createGenreServer(currentState: any, formData: FormData) {
  try {
    const genre = await genreAdminApi.createGenre(formData);
    if (genre.errors.length !== 0) return { errors: [genre.errors], success: false };

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
