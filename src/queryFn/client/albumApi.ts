import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { APIAlbum } from "@/types/apiTypes";

const getAlbumById = async (id: string) => {
  const response = await handleCustomApiRequest<APIAlbum>(
    GET_URL + "/api/albums/" + id,
    "GET",
    null
  );
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }
  return response.data;
};

export const albumApi = { getAlbumById };
