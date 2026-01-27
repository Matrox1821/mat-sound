import { albumIsExists, countAlbums, deleteAlbum, getAlbumsByPagination } from "./album.repository";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { AlbumBase } from "@shared-types/album.types";

const ALBUMS_PER_PAGES = 6;

export const getAlbumsPaginationInfo = async ({
  artistName = "",
  albumName = "",
}: {
  artistName?: string;
  albumName?: string;
}): Promise<{
  amount: number;
  pages: number;
}> => {
  const amount = await countAlbums({ albumName, artistName });

  const pages = Math.ceil(amount / ALBUMS_PER_PAGES);

  return { amount, pages };
};

export const deleteAlbumById = async ({ id }: { id: string }) => {
  const albumDeleted = await deleteAlbum(id);

  if (!albumDeleted) {
    throw new CustomError({
      errors: [{ message: `Could not delete album. No album found with ID: ${id}` }],
      msg: "Deletion failed: Album not found.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }
};

export const validateAlbumUniqueness = async ({ name, id }: { id?: string; name?: string }) => {
  const existingAlbum = await albumIsExists({ name, id });

  if (existingAlbum) {
    throw new CustomError({
      errors: [
        {
          message: name
            ? `An album with the name "${name}" already exists.`
            : `An album with ID ${id} is already registered.`,
        },
      ],
      msg: "Conflict: The album already exists in the database.",
      httpStatusCode: HttpStatusCode.CONFLICT,
    });
  }
};

export const getAlbumsByPage = async ({
  page,
  rows,
}: {
  page: number;
  rows: number;
}): Promise<AlbumBase[]> => {
  return (await getAlbumsByPagination({ page, rows })) as unknown as AlbumBase[];
};
