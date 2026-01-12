import { trackApi } from "@/queryFn/client/trackApi";
import { parseTracks } from "../parsers/trackParser";

export const fetchTrackDataById = async (id: string, userId: string = "") => {
  const track = await trackApi.getTrackById(id, userId);
  if (!track) return null;
  return parseTracks([track])![0];
};

export const fetchTracksRecomendedDataById = async (
  id: string,
  limit: number,
  userId: string = ""
) => {
  const tracks = await trackApi.getTracksExceptId(id, limit, userId);
  if (!tracks) return null;
  return parseTracks(tracks);
};
