import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";

const createGenre = async (genre: FormData) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/genre", "POST", genre, true);
};

const getGenres = async () => {
  try {
    const response = await handleCustomApiRequest<{ id: string; name: string }[]>(
      GET_URL + "/api/admin/genre",
      "GET",
      null,
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

const getGenresByPagination = async ({
  page = "1",
  rows = "6",
}: {
  page?: string;
  rows?: string;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", page);
  searchParams.set("rows", rows);
  try {
    const response = await handleCustomApiRequest<{ id: string; name: string }[]>(
      GET_URL + "/api/admin/genre/list" + "?" + searchParams.toString(),
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

const getGenresPaginationInfo = async () => {
  try {
    const response = await handleCustomApiRequest<{
      amount: number;
      pages: number;
    }>(GET_URL + "/api/admin/genre/pagination", "GET", null);
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};

export const genreAdminApi = {
  createGenre,
  getGenresByPagination,
  getGenresPaginationInfo,
  getGenres,
};
