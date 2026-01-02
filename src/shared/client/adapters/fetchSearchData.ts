import { searchApi } from "@/queryFn/client/searchApi";

type SearchEntity = "tracks" | "artists" | "albums" | "all";
export const fetchSearchData = async (q: URLSearchParams, entity: SearchEntity = "all") => {
  const result = await searchApi.searchData(q, entity);
  if (!result) return null;
  return result;
};
