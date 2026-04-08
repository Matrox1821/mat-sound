import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { PlaylistService } from "@/types/playlist.types";

const getPlaylistById = async (id: string): Promise<PlaylistService | null> => {
  try {
    const response = await handleCustomApiRequest<PlaylistService>(
      GET_URL + "/api/playlists/" + id,
      "GET",
      null,
      false,
      300,
    );
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};

export const playlistApi = {
  getPlaylistById,
};
