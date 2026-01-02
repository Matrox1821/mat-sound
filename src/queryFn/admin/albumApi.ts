import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { JsonValue } from "@prisma/client/runtime/library";

const createAlbum = async (album: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/album", "POST", album, true);
};
const getAlbumsByArtistsId = async (artists: string) => {
  const response = await handleCustomApiRequest(
    GET_URL + "/api/admin/album" + "?" + artists,
    "GET",
    null,
    true
  );

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

const getAlbumsByPage = async ({
  page = "1",
  rows = "6",
}: {
  page?: string;
  rows?: string;
}): Promise<{ id: string; name: string; cover: JsonValue }[] | undefined> => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", page);
  searchParams.append("rows", rows);

  const response = await handleCustomApiRequest<
    {
      id: string;
      name: string;
      cover: JsonValue;
    }[]
  >(GET_URL + "/api/admin/album/list" + "?" + searchParams, "GET", null);

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

const getAlbumsPaginationInfo = async () => {
  const response = await handleCustomApiRequest<{
    amount: number;
    pages: number;
  }>(GET_URL + "/api/admin/album/pagination", "GET", null);

  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }

  return response.data;
};

export const albumAdminApi = {
  createAlbum,
  getAlbumsByPage,
  getAlbumsByArtistsId,
  getAlbumsPaginationInfo,
};
