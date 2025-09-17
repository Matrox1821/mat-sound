"use server";

import { createTrack } from "@/queryFn/admin";

export async function createTrackServer(currentState: any, formData: FormData) {
  try {
    const track = await createTrack(formData);

    if (track.errors.length !== 0) return { errors: [track.errors], success: false };

    return { success: true, errors: [] };
  } catch (error) {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
