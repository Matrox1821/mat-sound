import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";

const createArtist = async (artist: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/artist", "POST", artist, true);
};

const getArtists = async () => {
  const response = await handleCustomApiRequest(GET_URL + "/api/admin/artist", "GET", null, true);
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

const getArtistsByPage = async ({
  page = "1",
  rows = "6",
}: {
  page?: string;
  rows?: string;
}): Promise<{ id: string; name: string; avatar: string }[] | undefined> => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", page);
  searchParams.append("rows", rows);

  const response = await handleCustomApiRequest<
    {
      id: string;
      name: string;
      avatar: string;
    }[]
  >(GET_URL + "/api/admin/artist/list" + "?" + searchParams, "GET", null);

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

const getArtistsPaginationInfo = async () => {
  const response = await handleCustomApiRequest<{
    amount: number;
    pages: number;
  }>(GET_URL + "/api/admin/artist/pagination", "GET", null);

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

export const artistAdminApi = {
  createArtist,
  getArtists,
  getArtistsByPage,
  getArtistsPaginationInfo,
};
