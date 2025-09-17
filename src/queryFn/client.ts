import { handleCustomApiRequest } from "@/shared/clientShared";
import { GET_URL } from "@/shared/constants";
import { ContentType, TracksByArtistIdQuery } from "@/types";
import {
  APIArtist,
  APIContent,
  APIRecentsArtistTracks,
  APIAlbum,
  APITrack,
} from "@/types/apiTypes";

interface TrackQuery {
  type?: ContentType[];
  limit?: number;
  remove?: string;
  filter?: { type: ContentType; id: string };
}
//#region content
const getContent = async ({ type = ["tracks"], limit, remove, filter }: TrackQuery) => {
  const typeLength = type?.length || 0;

  const typeQueryList = type.map((type, i) => `type=${type}${i < typeLength - 1 ? "&" : ""}`);

  let typeQuery = typeQueryList.join("");
  const limitQuery = Boolean(limit) ? `&limit=${limit}` : "";
  const dataToRemoveQuery = Boolean(remove) ? `&remove=${remove}` : "";
  const filterQuery = Boolean(filter) ? `&filter=${filter?.type}&filterId=${filter?.id}` : "";

  const parsedQuery = `${typeQuery}${limitQuery}${dataToRemoveQuery}${filterQuery}`;

  return await handleCustomApiRequest<APIContent[]>(
    GET_URL + "/api/content" + "?" + parsedQuery,
    "GET",
    null
  );
};
//#endregion

//#region by artist
const getArtistById = async (id: string) => {
  return await handleCustomApiRequest<APIArtist>(GET_URL + "/api/artists/" + id, "GET", null);
};

const getTracksByArtistId = async ({
  id,
  query,
}: {
  id: string;
  query?: TracksByArtistIdQuery;
}) => {
  const parsedQuery =
    query?.sortBy && query?.order
      ? `?sort=${query.sortBy}&order=${query.order}&limit=${query.limit}`
      : "";
  return await handleCustomApiRequest<{ track: APIRecentsArtistTracks }[]>(
    GET_URL + "/api/artists/" + id + "/tracks" + parsedQuery,
    "GET",
    null
  );
};
const getAlbumsByArtistId = async (id: string) => {
  return await handleCustomApiRequest<APIContent[]>(
    GET_URL + "/api/artists/" + id + "/albums",
    "GET",
    null
  );
};
//#endregion

const getAlbumById = async (id: string) => {
  return await handleCustomApiRequest<APIAlbum>(GET_URL + "/api/albums/" + id, "GET", null);
};

const getTrackById = async (id: string) => {
  return await handleCustomApiRequest<APITrack>(GET_URL + "/api/tracks/" + id, "GET", null);
};

export {
  getContent,
  getArtistById,
  getTracksByArtistId,
  getAlbumsByArtistId,
  getAlbumById,
  getTrackById,
};
