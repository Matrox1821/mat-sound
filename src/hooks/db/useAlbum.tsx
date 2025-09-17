import { getAlbumById } from "@/queryFn/client";
import { parseAlbum } from "@/shared/parsers";
import { albumPageProps } from "@/types";

export default async function getAlbum(id: string) {
  const album = await getAlbumById(id).then((data) => data.data || null);
  const parsedAlbum = parseAlbum(album);

  return { album: parsedAlbum as albumPageProps | null };
}
