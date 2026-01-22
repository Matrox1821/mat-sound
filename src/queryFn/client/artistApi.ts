import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { TracksByArtistIdQuery } from "@/types/common.types";
import { ArtistServer, ArtistTracks } from "@/types/artist.types";

const getArtistById = async (id: string, userId?: string): Promise<ArtistServer | null> => {
  const params = new URLSearchParams();
  if (userId) params.set("user_id", String(userId));
  try {
    const response = await handleCustomApiRequest<ArtistServer>(
      GET_URL + "/api/artists/" + id,
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

const getTracksByArtistId = async ({
  id,
  userId,
  query,
}: {
  id: string;
  userId?: string;
  query?: TracksByArtistIdQuery;
}): Promise<ArtistTracks[] | null> => {
  const params = new URLSearchParams();
  if (query?.sortBy) params.set("sort", query.sortBy);
  if (query?.order) params.set("order", query.order);
  if (query?.limit) params.set("limit", String(query.limit));
  if (userId) params.set("user_id", String(userId));
  try {
    const response = await handleCustomApiRequest<ArtistTracks[]>(
      GET_URL + "/api/artists/" + id + "/tracks" + "?" + params.toString(),
      "GET",
      null,
    );
    if (response.errors?.length || !response.data || !response.data?.length) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
/* const getAlbumsByArtistId = async (id: string) => {
  return await handleCustomApiRequest<APIContent[]>(
    GET_URL + "/api/artists/" + id + "/albums",
    "GET",
    null
  );
}; */

export const artistApi = {
  getArtistById,
  getTracksByArtistId,
};
