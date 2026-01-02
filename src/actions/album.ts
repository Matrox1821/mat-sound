"use server";

import { albumAdminApi } from "@/queryFn/admin/albumApi";

export async function createAlbumServer(currentState: any, formData: FormData) {
  try {
    const album = await albumAdminApi.createAlbum(formData);
    if (album.errors.length !== 0) return { errors: [album.errors], success: false };
    return { success: true, errors: [] };
  } catch (error) {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
