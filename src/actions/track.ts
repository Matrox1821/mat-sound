"use server";

import { parseTrackFormData, parseUpdatedTrackFormData } from "@/shared/formData/trackForm";
import {
  createTrack,
  createTracksBulk,
  deleteTrackById,
  updateTrack,
} from "@/shared/server/track/track.service";
import { trackBulkSchema } from "@/shared/utils/schemas/bulkValidations";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createTrackServer(currentState: any, formData: FormData) {
  try {
    const body = parseTrackFormData(formData);
    const track = await createTrack(body);

    if (!track) throw new Error();

    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
export async function updateTrackServer(currentState: any, formData: FormData) {
  try {
    const body = parseUpdatedTrackFormData(formData);
    const track = await updateTrack(body);
    if (!track) {
      throw new Error("Error en la edición");
    }
    return { success: true, errors: [] };
  } catch (error: any) {
    return { errors: [{ message: error.message }], success: false };
  }
}

export async function deleteTrackServer(id: string) {
  try {
    await deleteTrackById({ id });

    revalidatePath("/admin/track");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.errors?.[0]?.message || "Error al eliminar la canción",
    };
  }
}
const requestSchema = z.object({
  artistId: z.string().uuid("ID de artista inválido"),
  albumId: z.string().uuid("ID de álbum inválido"),
  tracks: z.array(trackBulkSchema).min(1, "Debes incluir al menos un track"),
});
export async function createTracksBulkServer(data: {
  artistId: string;
  albumId: string;
  tracks: any[];
}) {
  try {
    const validation = requestSchema.safeParse(data);
    const response = await createTracksBulk(validation);

    if (response) {
      revalidatePath("/admin/track");
      return { success: true };
    }

    return { success: false, error: "La API no devolvió una respuesta exitosa." };
  } catch (err: any) {
    console.error("Error en Server Action:", err);
    return { success: false, error: "Error de conexión con la API." };
  }
}
