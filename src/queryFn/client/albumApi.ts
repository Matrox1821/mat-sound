import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { AlbumById } from "@shared-types/album.types";
import { TrackById } from "@shared-types/track.types";

const getAlbumById = async (
  id: string,
): Promise<{
  album: AlbumById;
  recommendedTracks: TrackById[];
} | null> => {
  try {
    const response = await handleCustomApiRequest<{
      album: AlbumById;
      recommendedTracks: TrackById[];
    } | null>(GET_URL + "/api/albums/" + id, "GET", null);
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};

export const albumApi = { getAlbumById };
