"use server";
import {
  albumIsExists,
  countAlbums,
  createAlbumRepo,
  deleteAlbum,
  getAlbumsByPagination,
  updateAlbumCover,
} from "./album.repository";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { AlbumBase } from "@shared-types/album.types";
import { AlbumFormData } from "@/types/form.types";
import { handleCoverResizeAndUpload } from "./album.storage";
import { prisma } from "@config/db";
import z from "zod";

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

export const createAlbum = async (body: AlbumFormData) => {
  await validateAlbumUniqueness({ name: body.name });
  const album = await createAlbumRepo(body);

  const cover = body.cover && (await handleCoverResizeAndUpload(body.cover, album.id));

  const updatedAlbum = await updateAlbumCover({
    albumId: album.id,
    paths: cover ? cover.dbPath : null,
  });

  if (body.tracksOrder && Object.entries(body.tracksOrder).length > 0) {
    await prisma.album.update({
      where: { id: album.id },
      data: {
        tracks: {
          create: Object.entries(body.tracksOrder).map(([trackId, info]: [string, any]) => ({
            order: info.order,
            disk: info.disk,
            track: {
              connect: { id: trackId },
            },
          })),
        },
      },
    });
  }
  if (!updatedAlbum) {
    await Promise.all([deleteAlbumById({ id: album.id })]);
    throw new CustomError({
      errors: [{ message: "The album has not been updated" }],
      msg: "The album has not been updated",
      httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
  return updatedAlbum;
};

export const getAlbums = async (artistsId?: string | string[]) => {
  if (artistsId) {
    let albums = [];
    const newArtistsId = [...artistsId];
    albums = await prisma.album.findMany({
      where: {
        artists: {
          some: { id: { in: newArtistsId } },
        },
      },
    });

    if (albums.length === 0) {
      return null;
    }

    return albums;
  }
  const albums = await prisma.album.findMany({
    select: { name: true, id: true, cover: true },
    orderBy: { name: "asc" },
  });
  return albums;
};

export const updateAlbum = async (formData: AlbumFormData) => {
  const { id, cover, releaseDate, artists, tracks: __, tracksOrder: ___, ...data } = formData;
  if (!id) return null;
  if (cover) {
    const { dbPath } = await handleCoverResizeAndUpload(cover, id);

    await updateAlbumCover({ albumId: id, paths: dbPath });
  }
  const updated = await prisma.album.update({
    where: { id },
    data: {
      ...data,
      releaseDate: new Date(releaseDate),
      artists:
        artists && artists?.length > 0 ? { connect: artists.map((id) => ({ id })) } : undefined,
    },
  });

  return updated;
};

export const createAlbumsBulk = async (
  data: z.ZodSafeParseResult<{
    artistId: string;
    albums: {
      name: string;
      releaseDate: string;
    }[];
  }>,
) => {
  if (!data.success) {
    throw new CustomError({
      errors: data.error.issues,
      msg: "Invalid data format",
      httpStatusCode: HttpStatusCode.BAD_REQUEST,
    });
  }
  const { artistId, albums } = data.data;
  const results = await Promise.all(
    albums.map(async (album) => {
      const albumExist = await prisma.album.findFirst({
        where: { name: album.name, artists: { some: { id: artistId } } },
      });
      if (albumExist) return;
      return prisma.album.create({
        data: {
          name: album.name,
          releaseDate: new Date(album.releaseDate),
          artists: {
            connect: { id: artistId },
          },
        },
      });
    }),
  );

  if (results.length === 0) return null;

  return results;
};
