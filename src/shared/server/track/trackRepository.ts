"use server";

import { CustomError, ImageSizes, TrackFormData } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { prisma } from "@config/db";
import { updateArtistGenre } from "../artist/artistRepository";
import { updateAlbumGenre } from "../album/albumRepository";
import { Prisma } from "../../../../generated/prisma/client";
import { JsonValue } from "@prisma/client/runtime/client";

async function getRandomTracksIds(limit = 5, excludeId: string | null) {
  if (excludeId) {
    return await prisma.$queryRaw<{ id: string }[]>`
      SELECT "id" 
      FROM "Track"
      WHERE "id" <> ${excludeId}
      ORDER BY RANDOM()
      LIMIT ${limit};
    `;
  }

  return await prisma.$queryRaw<{ id: string }[]>`
    SELECT "id"
    FROM "Track"
    ORDER BY RANDOM()
    LIMIT ${limit};
  `;
}

export const getTrackById = async ({
  trackId,
  userId = "",
}: {
  trackId: string;
  userId: string;
}) => {
  const response = await prisma.track.findUnique({
    where: {
      id: trackId,
    },
    select: {
      id: true,
      name: true,
      cover: true,
      release_date: true,
      artists: {
        select: { id: true, avatar: true, name: true },
      },
      duration: true,
      song: true,
      likes: userId
        ? {
            where: {
              user_id: userId,
            },
            select: {
              user_id: true,
            },
            take: 1,
          }
        : false,

      _count: { select: { likes: true } },
      reproductions: true,
      lyrics: true,
      albums: {
        select: {
          album: {
            select: { id: true, cover: true, name: true },
          },
        },
      },
      genres: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!response)
    throw new CustomError({
      errors: [
        {
          message: "Track not found.",
        },
      ],
      msg: "Track not found.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  return response;
};

export const getTracks = async (
  limit: number,
  userId?: string,
  filter?: { by: "artists" | "tracks" | "albums" | "playlists" | "none"; id: string },
  userPlaylists?: {
    playlists: {
      id: string;
      cover?: ImageSizes;
      images?: string[];
      name: string;
      isInPlaylist: boolean;
      tracks: {
        track: {
          id: string;
          cover: any;
        };
      }[];
    }[];
  }
) => {
  let findBy = {};
  const ids = await getRandomTracksIds(5, filter?.by === "tracks" ? filter.id : null);
  if (filter?.by === "artists") {
    findBy = {
      ...findBy,
      artists: {
        every: {
          artist_id: filter.id,
        },
      },
    };
  }
  if (ids.length !== 0) {
    findBy = {
      ...findBy,
      id: { in: ids.map((t) => t.id) },
    };
  }

  const tracks = await prisma.track.findMany({
    take: limit,
    where: findBy,
    select: {
      id: true,
      name: true,
      cover: true,
      song: true,
      duration: true,
      reproductions: true,
      release_date: true,
      lyrics: true,
      collections: true,
      playlists: true,

      likes: userId
        ? {
            where: {
              user_id: userId,
            },
            select: {
              user_id: true,
            },
            take: 1,
          }
        : false,

      _count: { select: { likes: true } },
      artists: {
        select: { name: true, id: true, avatar: true },
      },
      albums: {
        select: { order: true, disk: true, album: { select: { id: true, name: true } } },
      },
    },
  });
  const newTracks = tracks.map((track) => {
    if (!userPlaylists)
      return {
        ...track,
        isLiked: userId ? track.likes.length > 0 : false,
        likes: undefined,
        type: "tracks",
      };

    return {
      ...track,
      isLiked: userId ? track.likes.length > 0 : false,
      likes: undefined,
      type: "tracks",
      playlists: userPlaylists.playlists.map((playlist) => ({
        ...playlist,
        isInPlaylist: playlist.tracks.some(
          ({ track: playlistTrack }) => playlistTrack.id === track.id
        ),
      })),
    };
  });

  return newTracks;
};

export const countTracks = async () => {
  return await prisma.track.count();
};

export const getTracksByPagination = async ({ page, rows }: { page: number; rows: number }) => {
  return await prisma.track.findMany({
    skip: (page - 1) * rows,
    take: rows,
    select: { name: true, id: true, cover: true },
  });
};

export const deleteTrack = async (id: string) => {
  return await prisma.track.delete({ where: { id } });
};

export const trackIsExists = async ({ name, id }: { id?: string; name?: string }) => {
  const where: Record<string, any> = {};

  if (name) where.name = name;
  if (id) where.id = id;

  if (Object.keys(where).length === 0) return false;

  const isExists = await prisma.track.findFirst({ where });
  return !!isExists;
};

export const createTrack = async (body: TrackFormData) => {
  const track = await prisma.track.create({
    data: {
      name: body.name,
      cover: {},
      song: "",
      release_date: new Date(body.release_date),
      duration: body.duration,
      reproductions: body.reproductions,
      lyrics: body.lyrics,
      artists: {
        connect: body.artists.map((artistId: string) => {
          return { id: artistId };
        }),
      },
      albums: {
        create: Object.entries(body.order_and_disk).map(([album_id, { order, disk }]) => {
          return { album_id: album_id, order, disk };
        }),
      },
      genres: {
        connect: body.genres.map((genre_id) => ({ id: genre_id })),
      },
    },
  });

  const album = await prisma.track.findFirst({
    where: { id: track.id },
    select: { albums: { select: { album_id: true } } },
  });
  const artist = await prisma.track.findFirst({
    where: { id: track.id },
    select: { artists: { select: { id: true } } },
  });
  if (track && album && artist)
    await Promise.all([
      ...album.albums.map(
        async ({ album_id }) => await updateAlbumGenre({ albumId: album_id, genresId: body.genres })
      ),
      ...artist.artists.map(
        async (artist) => await updateArtistGenre({ artistId: artist.id, genresId: body.genres })
      ),
    ]);

  return track;
};

export const updateTrackResourses = async ({
  id,
  paths,
  albumId,
}: {
  id: string;
  paths: {
    cover?: { sm: string; md: string; lg: string };
    song: string;
  };
  albumId?: string;
}) => {
  if (!paths.cover) {
    const albumCover = await prisma.album.findFirst({
      where: { id: albumId },
      select: { cover: true },
    });
    if (!albumCover)
      throw new CustomError({
        errors: [{ message: "The cover has not been updated" }],
        msg: "The cover has not been updated",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });
    return await prisma.track.update({
      where: {
        id,
      },
      data: {
        song: paths.song,
        cover: albumCover.cover ?? Prisma.JsonNull,
      },
    });
  }
  return await prisma.track.update({
    where: {
      id,
    },
    data: {
      song: paths.song,
      cover: paths.cover,
    },
  });
};
