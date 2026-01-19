import { albumPageProps } from "@/types/common.types";
import { APIAlbum } from "@/types/apiTypes";

export function parseAlbum(data: APIAlbum | null): albumPageProps | null {
  if (!data) return null;

  const { tracks, artists, release_date, ...restData } = data;
  return {
    ...restData,
    releaseDate: release_date,
    tracksCount: tracks?.length || 0,
    tracks: tracks?.map((track) => ({
      ...track.track,
      order: track.order,
      disk: track.disk,
    })),
    artists: artists?.map((artist) => ({ ...artist })),
  };
}
