import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { ArtistByPagination } from "@shared-types/artist.types";

const createArtist = async (artist: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/artist", "POST", artist, true);
};

const getArtists = async (searchQuery?: string) => {
  let url = `${GET_URL}/api/admin/artist`;

  if (searchQuery && searchQuery.trim() !== "") {
    const params = new URLSearchParams({ search: searchQuery });
    url += `?${params.toString()}`;
  }
  try {
    const response = await handleCustomApiRequest(url, "GET", null, true);
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};

const getArtistsByPage = async ({
  page = "1",
  rows = "6",
  query = "",
}: {
  page?: string;
  rows?: string;
  query?: string;
}): Promise<ArtistByPagination[] | null> => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", page);
  searchParams.append("rows", rows);
  searchParams.append("query", query);
  try {
    const response = await handleCustomApiRequest<ArtistByPagination[]>(
      GET_URL + "/api/admin/artist/list" + "?" + searchParams,
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

const getArtistsPaginationInfo = async ({ query = "" }: { query?: string }) => {
  const searchParams = new URLSearchParams();
  searchParams.append("query", query);
  try {
    const response = await handleCustomApiRequest<{
      amount: number;
      pages: number;
    }>(GET_URL + "/api/admin/artist/pagination" + "?" + searchParams, "GET", null);
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
const createArtistsBulk = async (data: any) => {
  try {
    const response = await handleCustomApiRequest(
      GET_URL + "/api/admin/artist/bulk",
      "POST",
      data,
      true,
    );
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
const deleteArtist = async (id: any) => {
  try {
    const response = await handleCustomApiRequest(
      GET_URL + "/api/admin/artist/" + id,
      "DELETE",
      null,
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
const updateArtist = async (artist: any) => {
  try {
    const response = await handleCustomApiRequest(
      GET_URL + "/api/admin/artist",
      "PATCH",
      artist,
      true,
    );
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
export const artistAdminApi = {
  createArtist,
  getArtists,
  getArtistsByPage,
  getArtistsPaginationInfo,
  createArtistsBulk,
  deleteArtist,
  updateArtist,
};
