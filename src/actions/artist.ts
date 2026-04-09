"use server";

import { parseArtistFormData, parseUpdateArtistFormData } from "@/shared/formData/artistForm";
import {
  createArtist,
  createArtistsBulk,
  updateArtist,
} from "@/shared/server/artist/artist.repository";
import { deleteArtistById } from "@/shared/server/artist/artist.service";
import { revalidatePath } from "next/cache";

export async function createArtistServer(currentState: any, formData: FormData) {
  try {
    const body = parseArtistFormData(formData);
    const artist = createArtist(body);
    if (!artist) throw new Error();
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
    const data = parseUpdateArtistFormData(formData);
    const artist = await updateArtist(data);
    if (!artist) throw new Error();
    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}

export async function createArtistsBulkServer(data: any) {
  try {
    const response = await createArtistsBulk(data);

    if (response) {
      revalidatePath("/admin/artist");
      return { success: true };
    }

    return { success: false, error: "La API no devolvió una respuesta exitosa." };
  } catch (err: any) {
    console.error("Error en Server Action:", err);
    return { success: false, error: "Error de conexión con la API." };
  }
}
