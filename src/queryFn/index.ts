import { handleCustomApiRequest } from "@/shared/clientShared";

const getUrl =
  process.env.NODE_ENV === "production"
    ? "https://learn-languages-zeta.vercel.app"
    : "http://localhost:3000";

const adminQuery = () => {
  const signinUser = async (userData: any) => {
    return await handleCustomApiRequest(
      getUrl + "/api/admin",
      "POST",
      userData
    );
  };
  const createTrack = async (track: any) => {
    return await handleCustomApiRequest(
      getUrl + "/api/track",
      "POST",
      track,
      true
    );
  };

  const createArtist = async (artist: any) => {
    return await handleCustomApiRequest(
      getUrl + "/api/artist",
      "POST",
      artist,
      true
    );
  };

  const createAlbum = async (album: any) => {
    return await handleCustomApiRequest(
      getUrl + "/api/album",
      "POST",
      album,
      true
    );
  };

  const getArtists = async () => {
    return await handleCustomApiRequest(
      getUrl + "/api/artist",
      "GET",
      null,
      true
    );
  };
  const getTracksByArtistsId = async (artists: string) => {
    return await handleCustomApiRequest(
      getUrl + "/api/track" + "?" + artists,
      "GET",
      null,
      true
    );
  };
  const getAlbumsByArtistsId = async (artists: string) => {
    return await handleCustomApiRequest(
      getUrl + "/api/album" + "?" + artists,
      "GET",
      null,
      true
    );
  };

  return {
    signinUser,
    createTrack,
    createArtist,
    getArtists,
    getTracksByArtistsId,
    createAlbum,
    getAlbumsByArtistsId,
  };
};

export { getUrl, adminQuery };
