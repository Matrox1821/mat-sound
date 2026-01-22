import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { AlbumById } from "@/types/album.types";

const getAlbumById = async (id: string): Promise<AlbumById | null> => {
  try {
    const response = await handleCustomApiRequest<AlbumById>(
      GET_URL + "/api/albums/" + id,
      "GET",
      null,
    );
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};

export const albumApi = { getAlbumById };
