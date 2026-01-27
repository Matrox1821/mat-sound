import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { TrackWithRecommendations } from "@shared-types/track.types";

const getTrackById = async (id: string): Promise<TrackWithRecommendations[] | null> => {
  try {
    const response = await handleCustomApiRequest<TrackWithRecommendations[]>(
      GET_URL + "/api/tracks/" + id,
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
): Promise<TrackWithRecommendations[] | null> => {
  const params = new URLSearchParams();
  params.set("exclude_id", String(id));
  params.set("limit", String(limit));

  try {
    const response = await handleCustomApiRequest<TrackWithRecommendations[]>(
      GET_URL + "/api/tracks/" + id + "?" + params.toString(),
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
