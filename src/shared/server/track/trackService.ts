import { redirect } from "next/navigation";
import { countTracks, deleteTrack, getTracksByPagination } from "./trackRepository";

const TRACKS_PER_PAGES = 6;

export const getTracksPaginationInfo = async () => {
  const amount = await countTracks();
  const pages = Math.ceil(amount / TRACKS_PER_PAGES);
  return { amount, pages };
};

export const deleteTrackById = async ({
  id,
  pathToRedirect,
}: {
  id: string;
  pathToRedirect: string;
}) => {
  await deleteTrack(id);
  redirect(pathToRedirect);
};

export const getTracksByPage = async ({ page, rows }: { page: number; rows: number }) => {
  return await getTracksByPagination({ page, rows });
};
