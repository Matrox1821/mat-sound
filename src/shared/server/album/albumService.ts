import { redirect } from "next/navigation";
import { countAlbums, deleteAlbum, getAlbumsByPagination } from "./albumRepository";

const ALBUMS_PER_PAGES = 6;

export const getAlbumsPaginationInfo = async () => {
  const amount = await countAlbums();
  const pages = Math.ceil(amount / ALBUMS_PER_PAGES);
  return { amount, pages };
};

export const deleteAlbumById = async ({
  id,
  pathToRedirect,
}: {
  id: string;
  pathToRedirect: string;
}) => {
  await deleteAlbum(id);
  redirect(pathToRedirect);
};

export const getAlbumsByPage = async ({ page, rows }: { page: number; rows: number }) => {
  return await getAlbumsByPagination({ page, rows });
};
