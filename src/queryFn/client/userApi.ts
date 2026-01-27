import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { UserFormData } from "@/types/form.types";
import { MediaCard, UserData } from "@shared-types/user.types";

const validateUserAndFetch = async ({
  username,
}: {
  username?: string | null;
}): Promise<UserData | null> => {
  if (!username || username === "null") return null;

  try {
    const response = await handleCustomApiRequest<UserData>(
      `${GET_URL}/api/user/${username}`,
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

const updateProfile = async (username: string, data: UserFormData) => {
  if (!username || username === "null") return null;

  try {
    const response = await handleCustomApiRequest(`${GET_URL}/api/user/${username}`, "PATCH", data);

    if (response.errors?.length || !response.data || response.data.length === 0) {
      throw new Error(response.message || "Error en la petición");
    }

    return response.data;
  } catch {
    return null;
  }
};

const validateUserAndFetchMediaCard = async ({
  username,
  endpoint,
}: {
  username?: string | null;
  endpoint: string;
}): Promise<MediaCard[] | null> => {
  if (!username || username === "null") return null;

  try {
    const response = await handleCustomApiRequest(
      `${GET_URL}/api/user/${username}${endpoint}`,
      "GET",
      null,
    );

    if (response.errors?.length || !response.data || response.data.length === 0) {
      throw new Error(response.message || "Error en la petición");
    }

    return response.data;
  } catch {
    return null;
  }
};

export const userApi = {
  getUser: (username?: string | null) => validateUserAndFetch({ username }),
  getFavorites: (username?: string | null) =>
    validateUserAndFetchMediaCard({ username, endpoint: "/favorites" }),
  getCollection: (username?: string | null) =>
    validateUserAndFetchMediaCard({ username, endpoint: "/collection" }),
  getPlaylists: (username?: string | null) =>
    validateUserAndFetchMediaCard({ username, endpoint: "/playlists" }),
  updateProfile: (username: string, data: UserFormData) => updateProfile(username, data),
};
