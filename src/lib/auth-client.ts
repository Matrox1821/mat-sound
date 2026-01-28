import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { GET_URL } from "@/shared/utils/constants";
export const authClient = createAuthClient({
  baseURL: GET_URL,
  plugins: [usernameClient()],
});
