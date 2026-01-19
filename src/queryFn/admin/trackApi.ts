import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { TrackByPagination } from "@/types/track.types";

const createTrack = async (track: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/track", "POST", track, true);
};

const getTracksByArtistsId = async (artists: string[]) => {
  const searchParams = new URLSearchParams();
  artists.forEach((artistsId) => searchParams.append("artists_id", artistsId));
  const response = await handleCustomApiRequest(
    GET_URL + "/api/admin/track" + "?" + searchParams,
    "GET",
    null,
    true,
  );

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

const getTracks = async () => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/track", "GET", null, true);
};

const getTracksByPage = async ({
  page = "1",
  rows = "6",
  artistName = "",
  albumName = "",
  trackName = "",
}: {
  page?: string;
  rows?: string;
  artistName?: string;
  albumName?: string;
  trackName?: string;
}): Promise<TrackByPagination[] | undefined> => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", page);
  searchParams.append("rows", rows);
  searchParams.append("artistName", artistName);
  searchParams.append("albumName", albumName);
  searchParams.append("trackName", trackName);

  const response = await handleCustomApiRequest<TrackByPagination[]>(
    GET_URL + "/api/admin/track/list" + "?" + searchParams,
    "GET",
    null,
  );

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

const getTracksPaginationInfo = async ({
  artistName = "",
  albumName = "",
  trackName = "",
}: {
  artistName?: string;
  albumName?: string;
  trackName?: string;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.append("artistName", artistName);
  searchParams.append("albumName", albumName);
  searchParams.append("trackName", trackName);
  const response = await handleCustomApiRequest<{
    amount: number;
    pages: number;
  }>(GET_URL + "/api/admin/track/pagination" + "?" + searchParams, "GET", null);

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

const createTracksBulk = async (data: any) => {
  try {
    const response = await handleCustomApiRequest(
      GET_URL + "/api/admin/track/bulk",
      "POST",
      data,
      true,
    );
    if (response.errors?.length) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
const updateTrack = async (track: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/track", "PATCH", track, true);
};
export const trackAdminApi = {
  createTrack,
  getTracks,
  getTracksByArtistsId,
  getTracksByPage,
  getTracksPaginationInfo,
  createTracksBulk,
  updateTrack,
};
