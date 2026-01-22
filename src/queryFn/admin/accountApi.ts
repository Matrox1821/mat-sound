import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";

export const signinAdminUser = async (userData: any) => {
  try {
    const response = await handleCustomApiRequest(GET_URL + "/api/admin", "POST", userData);

    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
