import { handleCustomApiRequest } from "@/shared/clientShared";
import { GET_URL } from "@/shared/constants";

const signinAdminUser = async (userData: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin", "POST", userData);
};

const createTrack = async (track: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/track", "POST", track, true);
};

const createArtist = async (artist: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/artist", "POST", artist, true);
};

const createAlbum = async (album: any) => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/album", "POST", album, true);
};

const getArtists = async () => {
  return await handleCustomApiRequest(GET_URL + "/api/admin/artist", "GET", null, true);
};
const getTracksByArtistsId = async (artists: string) => {
  return await handleCustomApiRequest(
    GET_URL + "/api/admin/track" + "?" + artists,
    "GET",
    null,
    true
  );
};
const getAlbumsByArtistsId = async (artists: string) => {
  return await handleCustomApiRequest(
    GET_URL + "/api/admin/album" + "?" + artists,
    "GET",
    null,
    true
  );
};

export {
  signinAdminUser,
  createTrack,
  createArtist,
  getArtists,
  getTracksByArtistsId,
  createAlbum,
  getAlbumsByArtistsId,
};
