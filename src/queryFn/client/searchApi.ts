import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { ImageSizes } from "@/types/apiTypes";
import { APITrack } from "@/types/trackProps";

interface responseData {
  id: string;
  name: string;
  image: ImageSizes;
  type?: "track" | "album" | "artist";
  artists?: { id: string; name: string }[];
  tracks?: APITrack[];
}

type SearchEntity = "tracks" | "artists" | "albums" | "all";

const searchData = async (q: URLSearchParams, entity: SearchEntity = "all") => {
  const endpoint = entity === "all" ? "" : `/${entity}`;
  const response = await handleCustomApiRequest<responseData[]>(
    `${GET_URL}/api/search${endpoint}?${q.toString()}`,
    "GET",
    null
  );
  if (response.errors?.length) {
    throw new Error(response.message || "Error en la petición");
  }
  return response.data;
};

export const searchApi = { searchData };
