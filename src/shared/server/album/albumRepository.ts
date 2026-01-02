import { AlbumFormData } from "@/types/apiTypes";
import { prisma } from "@config/db";
export const getAlbums = async (
  limit: number,
  filter?: { by: "artists" | "tracks" | "albums" | "playlists" | "none"; id: string }
) => {
  let findBy = {};
  if (filter?.by === "artists") {
    findBy = { artists: { some: { artist_id: filter.id } } };
  }

  const albums = await prisma.album.findMany({
    take: limit,
    where: findBy,
    select: {
      id: true,
      name: true,
      cover: true,
      artists: {
        select: { artist: { select: { id: true, avatar: true, name: true } } },
      },
    },
  });
  return albums.map((album) => ({ ...album, type: "albums" }));
};

export const countAlbums = async () => {
  return await prisma.album.count();
};

export const deleteAlbum = async (id: string) => {
  return await prisma.album.delete({ where: { id } });
};

export const getAlbumsByPagination = async ({ page, rows }: { page: number; rows: number }) => {
  return await prisma.album.findMany({
    skip: (page - 1) * rows,
    take: rows,
    select: { name: true, id: true, cover: true },
  });
};

export const albumIsExists = async ({ name, id }: { id?: string; name?: string }) => {
  const where: Record<string, any> = {};

  if (name) where.name = name;
  if (id) where.id = id;

  if (Object.keys(where).length === 0) return false;

  const isExists = await prisma.album.findFirst({ where });
  return !!isExists;
};

export const createAlbum = async (body: AlbumFormData) => {
  const newAlbum = await prisma.album.create({
    data: {
      name: body.name,
      cover: {},
      release_date: new Date(body.release_date),

      artists: {
        create: body.artists.map((artist_id: string) => ({ artist_id })),
      },
    },
  });
  return newAlbum;
};

export const updateAlbumCover = async ({
  albumId,
  paths,
}: {
  albumId: string;
  paths: { sm: string; md: string; lg: string };
}) => {
  const updatedAlbum = await prisma.album.update({
    where: {
      id: albumId,
    },
    data: {
      cover: paths,
    },
  });

  return updatedAlbum;
};

export const updateAlbumGenre = async ({
  albumId,
  genresId,
}: {
  albumId: string;
  genresId: string[];
}) => {
  const genresInAlbum = await prisma.albumGenre.findMany({
    where: { album_id: albumId },
    select: { genre_id: true },
  });

  const filteredGenres = genresId.filter((id) => {
    id !== genresInAlbum.find(({ genre_id }) => genre_id === id)?.genre_id;
  });

  await prisma.album.update({
    where: { id: albumId },
    data: {
      genres: {
        create: filteredGenres.map((genre_id) => ({ genre_id })),
      },
    },
  });
};

export const deleteAlbumById = async (id: string) => {
  return await prisma.album.delete({ where: { id } });
};
