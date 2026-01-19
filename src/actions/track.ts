"use server";

import { trackAdminApi } from "@/queryFn/admin/trackApi";
import { deleteTrackById } from "@/shared/server/track/track.service";
import { revalidatePath } from "next/cache";

export async function createTrackServer(currentState: any, formData: FormData) {
  try {
    const track = await trackAdminApi.createTrack(formData);

    if (track.errors.length !== 0) return { errors: [track.errors], success: false };

    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
export async function updateTrackServer(currentState: any, formData: FormData) {
  try {
    const track = await trackAdminApi.updateTrack(formData);
    if (track.errors.length !== 0) return { errors: [track.errors], success: false };
    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
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
