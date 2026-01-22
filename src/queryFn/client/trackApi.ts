import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { TrackByIdApiResponse } from "@/types/track.types";

const getTrackById = async (
  id: string,
  userId: string = "",
): Promise<TrackByIdApiResponse[] | null> => {
  try {
    const response = await handleCustomApiRequest<TrackByIdApiResponse[]>(
      GET_URL + "/api/tracks/" + id + "?user_id=" + userId,
      "GET",
      null,
    );
    if (response.errors?.length || !response.data || response.data.length === 0) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};

const getTracksExceptId = async (
  id: string,
  limit: number,
  userId: string = "",
): Promise<TrackByIdApiResponse[] | null> => {
  try {
    const response = await handleCustomApiRequest<TrackByIdApiResponse[]>(
      GET_URL + "/api/tracks/" + id + "?limit=" + limit + "&user_id=" + userId,
      "GET",
      null,
    );
    if (response.errors?.length || !response.data || !response.data.length) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};

export const trackApi = { getTrackById, getTracksExceptId };
