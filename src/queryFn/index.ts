import { handleCustomApiRequest } from "../shared/clientShared";
import type {
  trackProps,
  albumByArtistIdProps,
  albumByIdProps,
  artistProps,
  trackByArtistIdProps,
  albumProps,
} from "../types/apiTypes";

const getUrl =
  process.env.SERVER_DOMAIN === "vercel"
    ? "https://matsound.vercel.app"
    : process.env.SERVER_DOMAIN === "netlify"
    ? "https://matsound.netlify.app"
    : "http://localhost:4321";

const getTrackById = async (id: string) => {
  return await handleCustomApiRequest<{ track: trackProps }>(
    getUrl + `/api/tracks/${id}`,
    "GET",
    null
  );
};

const getTracks = async ({ query = "" }: { query?: string }) => {
  return await handleCustomApiRequest<{ tracks: trackProps[] }>(
    `${getUrl}/api/tracks${query}`,
    "GET",
    null
  );
};

const getAlbums = async () => {
  return await handleCustomApiRequest<{ albums: albumProps[] }>(
    getUrl + `/api/albums`,
    "GET",
    null
  );
};

const getAlbumById = async (id: string) => {
  return await handleCustomApiRequest<{ album: albumByIdProps }>(
    getUrl + `/api/albums/${id}`,
    "GET",
    null
  );
};

const getArtists = async () => {
  return await handleCustomApiRequest<{
    artists: { id: string; name: string; avatar: string }[];
  }>(getUrl + `/api/artists`, "GET", null);
};

const getArtistById = async (id: string) => {
  return await handleCustomApiRequest<{ artist: artistProps }>(
    getUrl + `/api/artists/${id}`,
    "GET",
    null
  );
};

const getAlbumsByArtistId = async (id: string) => {
  return await handleCustomApiRequest<{ albums: albumByArtistIdProps[] }>(
    getUrl + `/api/artists/${id}/albums`,
    "GET",
    null
  );
};

const getTracksByArtistId = async (id: string) => {
  return await handleCustomApiRequest<{ tracks: trackByArtistIdProps[] }>(
    getUrl + `/api/artists/${id}/tracks`,
    "GET",
    null
  );
};

const getTracksByAlbumId = async (id: string) => {
  return await handleCustomApiRequest<{ tracks: trackProps[] }>(
    getUrl + `/api/albums/${id}/tracks`,
    "GET",
    null
  );
};

const getSearchResults = async ({ query = "" }: { query?: string }) => {
  return await handleCustomApiRequest<any>(
    getUrl + `/api/search${query}`,
    "GET",
    null
  );
};

export {
  getTrackById,
  getTracks,
  getAlbums,
  getAlbumById,
  getArtists,
  getArtistById,
  getUrl,
  getAlbumsByArtistId,
  getTracksByArtistId,
  getTracksByAlbumId,
  getSearchResults,
};
