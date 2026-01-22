"use server";

import { albumAdminApi } from "@/queryFn/admin/albumApi";
import { deleteAlbumById } from "@/shared/server/album/album.service";
import { revalidatePath } from "next/cache";

export async function createAlbumServer(currentState: any, formData: FormData) {
  try {
    const album = await albumAdminApi.createAlbum(formData);
    if (album.errors.length !== 0) return { errors: [album.errors], success: false };
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
    const album = await albumAdminApi.updateAlbum(formData);
    if (album.errors.length !== 0) return { errors: [album.errors], success: false };
    return { success: true, errors: [] };
  } catch {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}

export async function createAlbumsBulkServer(data: { artistId: string; albums: any[] }) {
  try {
    const response = await albumAdminApi.createAlbumsBulk(data);

    if (response) {
      revalidatePath("/admin/album");
      return { success: true };
    }

    return { success: false, error: "La API no devolvió una respuesta exitosa." };
  } catch (err: any) {
    console.error("Error en Server Action:", err);
    return { success: false, error: "Error de conexión con la API." };
  }
}
