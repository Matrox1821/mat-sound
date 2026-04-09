"use server";

import { parseAlbumFormData, parseUpdatedAlbumFormData } from "@/shared/formData/albumForm";
import {
  createAlbum,
  createAlbumsBulk,
  deleteAlbumById,
  updateAlbum,
} from "@/shared/server/album/album.service";
import { albumBulkSchema } from "@/shared/utils/schemas/bulkValidations";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createAlbumServer(currentState: any, formData: FormData) {
  try {
    const body = parseAlbumFormData(formData);
    const album = await createAlbum(body);
    if (!album) throw new Error();
    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}

export async function deleteAlbumServer(id: string) {
  try {
    await deleteAlbumById({ id });

    revalidatePath("/admin/album");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.errors?.[0]?.message || "Error al eliminar el álbum",
    };
  }
}

export async function updateAlbumServer(currentState: any, formData: FormData) {
  try {
    const data = parseUpdatedAlbumFormData(formData);
    const album = await updateAlbum(data);
    if (!album) throw new Error();
    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}

const requestSchema = z.object({
  artistId: z.string().min(10, "El id del artista es obligatorio"),
  albums: z.array(albumBulkSchema).min(1, "Debes incluir al menos un álbum"),
});
export async function createAlbumsBulkServer(data: { artistId: string; albums: any[] }) {
  try {
    const validation = requestSchema.safeParse(data);
    const response = await createAlbumsBulk(validation);
    if (!response) throw new Error();
    return { success: true };
  } catch (err: any) {
    console.error("Error en Server Action:", err);
    return { success: false, error: "Error de conexión con la API." };
  }
}
