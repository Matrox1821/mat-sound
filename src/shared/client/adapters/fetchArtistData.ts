import { artistApi } from "@/queryFn/client/artistApi";
import { TracksByArtistIdQuery } from "@/types/common.types";
import { parseArtist, parsePopularTracks } from "../parsers/artistParser";

export const fetchArtistDataById = async (id: string) => {
  const artist = await artistApi.getArtistById(id);
  if (!artist) return null;
  return parseArtist(artist);
};

export const fetchTracksDataByArtistId = async ({
  id,
  query,
}: {
  id: string;
  query?: TracksByArtistIdQuery;
}) => {
  const tracks = await artistApi.getTracksByArtistId({ id, query });
  if (!tracks) return null;
  return parsePopularTracks(tracks);
};
