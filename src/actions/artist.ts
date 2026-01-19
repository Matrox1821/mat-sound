"use server";

import { artistAdminApi } from "@/queryFn/admin/artistApi";
import { deleteArtistById } from "@/shared/server/artist/artist.service";
import { revalidatePath } from "next/cache";

export async function createArtistServer(currentState: any, formData: FormData) {
  try {
    const artist = await artistAdminApi.createArtist(formData);
    if (artist.errors.length !== 0) return { errors: [artist.errors], success: false };
    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}

export async function deleteArtistServer(id: string) {
  try {
    await deleteArtistById({ id });

    revalidatePath("/admin/artist");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.errors?.[0]?.message || "Error al eliminar el artista",
    };
  }
}

export async function updateArtistServer(currentState: any, formData: FormData) {
  try {
    const artist = await artistAdminApi.updateArtist(formData);
    if (artist.errors.length !== 0) return { errors: [artist.errors], success: false };
    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
