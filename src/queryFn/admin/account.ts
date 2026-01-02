import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";

export const signinAdminUser = async (userData: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin", "POST", userData);
};
