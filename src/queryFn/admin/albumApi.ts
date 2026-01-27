import { handleCustomApiRequest } from "@/shared/client/clientShared";
import { GET_URL } from "@/shared/utils/constants";
import { AlbumByPagination } from "@shared-types/album.types";
import { ImageSizes } from "@shared-types/common.types";

const createAlbum = async (album: any) => {
  try {
    const response = await handleCustomApiRequest(
      GET_URL + "/api/admin/album",
      "POST",
      album,
      true,
    );
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
const getAlbumsByArtistsId = async (artists: string[]) => {
  const searchParams = new URLSearchParams();
  artists.forEach((artistsId) => searchParams.append("artists_id", artistsId));
  try {
    const response = await handleCustomApiRequest(
      GET_URL + "/api/admin/album" + "?" + searchParams,
      "GET",
      null,
      true,
    );

    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }

    return response.data;
  } catch {
    return null;
  }
};

const getAlbumsByPage = async ({
  page = "1",
  rows = "6",
  artistName = "",
  albumName = "",
}: {
  page?: string;
  rows?: string;
  artistName?: string;
  albumName?: string;
}): Promise<AlbumByPagination[] | null> => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", page);
  searchParams.append("rows", rows);
  searchParams.append("artistName", artistName);
  searchParams.append("albumName", albumName);
  try {
    const response = await handleCustomApiRequest<AlbumByPagination[]>(
      GET_URL + "/api/admin/album/list" + "?" + searchParams,
      "GET",
      null,
    );

    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }

    return response.data;
  } catch {
    return null;
  }
};

const getAlbumsPaginationInfo = async ({
  artistName = "",
  albumName = "",
}: {
  artistName?: string;
  albumName?: string;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.append("artistName", artistName);
  searchParams.append("albumName", albumName);
  try {
    const response = await handleCustomApiRequest<{
      amount: number;
      pages: number;
    }>(GET_URL + "/api/admin/album/pagination" + "?" + searchParams, "GET", null);
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};

const createAlbumsBulk = async (data: any) => {
  try {
    const response = await handleCustomApiRequest(
      GET_URL + "/api/admin/album/bulk",
      "POST",
      data,
      true,
    );
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
const updateAlbum = async (album: any) => {
  try {
    const response = await handleCustomApiRequest(
      GET_URL + "/api/admin/album",
      "PATCH",
      album,
      true,
    );
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
const getAlbums = async () => {
  try {
    const response = await handleCustomApiRequest<
      {
        name: string;
        id: string;
        cover: ImageSizes;
      }[]
    >(GET_URL + "/api/admin/album", "GET", null, true);
    if (response.errors?.length || !response.data) {
      throw new Error(response.message || "Error en la petición");
    }
    return response.data;
  } catch {
    return null;
  }
};
export const albumAdminApi = {
  getAlbums,
  createAlbum,
  getAlbumsByPage,
  getAlbumsByArtistsId,
  getAlbumsPaginationInfo,
  createAlbumsBulk,
  updateAlbum,
};
