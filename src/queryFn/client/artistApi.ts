import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { TracksByArtistIdQuery } from "@/types";
import { APIArtist, APIArtistTrack } from "@/types/apiTypes";

const getArtistById = async (id: string) => {
  const response = await handleCustomApiRequest<APIArtist>(
    GET_URL + "/api/artists/" + id,
    "GET",
    null
  );
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }
  return response.data;
};

const getTracksByArtistId = async ({
  id,
  query,
}: {
  id: string;
  query?: TracksByArtistIdQuery;
}) => {
  const params = new URLSearchParams();
  if (query?.sortBy) params.set("sort", query.sortBy);
  if (query?.order) params.set("order", query.order);
  if (query?.limit) params.set("limit", String(query.limit));
  const response = await handleCustomApiRequest<APIArtistTrack[]>(
    GET_URL + "/api/artists/" + id + "/tracks" + "?" + params.toString(),
    "GET",
    null
  );
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }
  return response.data;
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
