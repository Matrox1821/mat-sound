"use server";

import { trackAdminApi } from "@/queryFn/admin/trackApi";

export async function createTrackServer(currentState: any, formData: FormData) {
  try {
    const track = await trackAdminApi.createTrack(formData);

    if (track.errors.length !== 0) return { errors: [track.errors], success: false };

    return { success: true, errors: [] };
  } catch (error) {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
