"use server";

import { adminQuery } from "@/queryFn";

export async function createAlbumServer(currentState: any, formData: FormData) {
  try {
    const album = await adminQuery().createAlbum(formData);
    if (album.errors.length !== 0)
      return { errors: [album.errors], success: false };
    return { success: true, errors: [] };
  } catch (error) {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
