import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";

const validateUserAndFetch = async (userId: string | undefined, endpoint: string) => {
  if (!userId || userId === "null") return null;

  try {
    const response = await handleCustomApiRequest(
      `${GET_URL}/api/user/${userId}${endpoint}`,
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

export const userApi = {
  getUser: (id?: string) => validateUserAndFetch(id, ""),
  getFavorites: (id?: string) => validateUserAndFetch(id, "/favorites"),
  getCollection: (id?: string) => validateUserAndFetch(id, "/collection"),
};
