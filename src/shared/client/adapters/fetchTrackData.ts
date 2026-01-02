import { trackApi } from "@/queryFn/client/trackApi";
import { parseTracks } from "../parsers/trackParser";

export const fetchTrackDataById = async (id: string) => {
  const track = await trackApi.getTrackById(id);
  if (!track) return null;
  return parseTracks([track])![0];
};

export const fetchTracksRecomendedDataById = async (id: string, limit: number) => {
  const tracks = await trackApi.getTracksExceptId(id, limit);
  if (!tracks) return null;
  return parseTracks(tracks);
};
