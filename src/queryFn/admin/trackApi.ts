import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";

const createTrack = async (track: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/track", "POST", track, true);
};

const getTracksByArtistsId = async (artists: string) => {
  const response = await handleCustomApiRequest(
    GET_URL + "/api/admin/track" + "?" + artists,
    "GET",
    null,
    true
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
}: {
  page?: string;
  rows?: string;
}): Promise<{ id: string; name: string; cover: string }[] | undefined> => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", page);
  searchParams.append("rows", rows);

  const response = await handleCustomApiRequest<
    {
      id: string;
      name: string;
      cover: string;
    }[]
  >(GET_URL + "/api/admin/track/list" + "?" + searchParams, "GET", null);

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

const getTracksPaginationInfo = async () => {
  const response = await handleCustomApiRequest<{
    amount: number;
    pages: number;
  }>(GET_URL + "/api/admin/track/pagination", "GET", null);

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

export const trackAdminApi = {
  createTrack,
  getTracks,
  getTracksByArtistsId,
  getTracksByPage,
  getTracksPaginationInfo,
};
