import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";

const getUser = async (userId: string) => {
  const response = await handleCustomApiRequest(GET_URL + "/api/user/" + userId, "GET", null);
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }
  return response.data;
};
const getFavorites = async (userId: any) => {
  const response = await handleCustomApiRequest(
    GET_URL + "/api/user/" + userId + "/favorites",
    "GET",
    null
  );
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }
  return response.data;
};

export const userApi = { getUser, getFavorites };
