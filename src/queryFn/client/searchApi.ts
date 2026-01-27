import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { ImageSizes } from "@shared-types/common.types";
import { APITrack } from "@shared-types/trackProps";

interface responseData {
  id: string;
  name: string;
  image: ImageSizes;
  type?: "track" | "album" | "artist";
  artists?: { id: string; name: string }[];
  tracks?: APITrack[];
}

type SearchEntity = "tracks" | "artists" | "albums" | "all";

const searchData = async (
  q: URLSearchParams,
  entity: SearchEntity = "all",
): Promise<responseData[] | null> => {
  const endpoint = entity === "all" ? "" : `/${entity}`;
  try {
    const response = await handleCustomApiRequest<responseData[]>(
      `${GET_URL}/api/search${endpoint}?${q.toString()}`,
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

export const searchApi = { searchData };
