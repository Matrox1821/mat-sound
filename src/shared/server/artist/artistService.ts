import { redirect } from "next/navigation";
import {
  countArtists,
  getArtists,
  deleteArtistById as deleteArtist,
  artistIsExists,
  updateArtistImages,
  getArtistsByPagination,
} from "./artistRepository";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { GET_BUCKET_URL } from "@/shared/utils/constants";

const ARTISTS_PER_PAGES = 6;

export const getArtistForContent = async (limit: number) => {
  const artists = await getArtists(limit);
  return artists.map((artist) => ({ ...artist, type: "artists" }));
};

export const checkArtistExists = async ({ name, id }: { name?: string; id?: string }) => {
  const existingArtist = await artistIsExists({ name, id });
  if (existingArtist) {
    throw new CustomError({
      errors: [{ message: "Artist already exists." }],
      msg: "Artist already exists.",
      httpStatusCode: HttpStatusCode.CONFLICT,
    });
  }
};

export const getArtistsPaginationInfo = async () => {
  const amount = await countArtists();
  const pages = Math.ceil(amount / ARTISTS_PER_PAGES);
  return { amount, pages };
};
export const deleteArtistById = async ({
  id,
  pathToRedirect,
}: {
  id: string;
  pathToRedirect: string;
}) => {
  await deleteArtist(id);
  redirect(pathToRedirect);
};

export const getArtistsByPage = async ({ page, rows }: { page: number; rows: number }) => {
  return await getArtistsByPagination({ page, rows });
};

type ImageSizes = {
  sm: string;
  md: string;
  lg: string;
};
export const addImagePathsToArtist = async ({
  artistId,
  paths,
}: {
  artistId: string;
  paths: { avatar: ImageSizes; mainCover: string; covers: string[] };
}) => {
  const { avatar, mainCover, covers } = paths;
  const parsedCovers = covers.map((coverPath) => GET_BUCKET_URL + coverPath);

  const updatedArtist = await updateArtistImages({
    id: artistId,
    paths: {
      avatar,
      covers: parsedCovers,
      mainCover: GET_BUCKET_URL + mainCover,
    },
  });
  if (!updatedArtist)
    throw new CustomError({
      errors: [{ message: "The artist has not been updated" }],
      msg: "The artist has not been updated",
      httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  return updatedArtist;
};
