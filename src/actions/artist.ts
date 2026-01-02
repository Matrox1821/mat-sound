"use server";

import { artistAdminApi } from "@/queryFn/admin/artistApi";

export async function createArtistServer(currentState: any, formData: FormData) {
  try {
    const artist = await artistAdminApi.createArtist(formData);
    if (artist.errors.length !== 0) return { errors: [artist.errors], success: false };
    return { success: true, errors: [] };
  } catch (error) {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
