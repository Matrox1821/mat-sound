import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { APITrack } from "@/types/trackProps";

const getTrackById = async (id: string) => {
  const response = await handleCustomApiRequest<APITrack>(
    GET_URL + "/api/tracks/" + id,
    "GET",
    null
  );
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }
  return response.data;
};

const getTracksExceptId = async (id: string, limit: number) => {
  const response = await handleCustomApiRequest<APITrack[]>(
    GET_URL + "/api/tracks/" + id + "?limit=" + limit,
    "GET",
    null
  );
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }
  return response.data;
};

export const trackApi = { getTrackById, getTracksExceptId };
