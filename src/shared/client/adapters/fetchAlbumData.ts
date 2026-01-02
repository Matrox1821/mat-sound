import { albumApi } from "@/queryFn/client/albumApi";
import { parseAlbum } from "../parsers/albumParser";

export const fetchAlbumDataById = async (id: string) => {
  const album = await albumApi.getAlbumById(id);
  if (!album) return null;
  return parseAlbum(album);
};
