"use server";
import { auth } from "@/lib/auth";
import { ImageSizes } from "@/types/common.types";
import {
  CollectionAlbum,
  CollectionPlaylist,
  CollectionTrack,
  PlaylistDetails,
  UserCollection,
} from "@/types/user.types";
import { prisma } from "@config/db";
import { headers } from "next/headers";

export async function getUserCollection(): Promise<UserCollection[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];
  const collectionObject = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      collection: {
        select: {
          albums: {
            select: {
              addedAt: true,
              album: {
                select: {
                  id: true,
                  name: true,
                  cover: true,
                  _count: { select: { tracks: true } },
                  artists: { select: { id: true, avatar: true, name: true } },
                },
              },
            },
          },
          tracks: {
            select: {
              addedAt: true,
              track: {
                select: {
                  id: true,
                  name: true,
                  cover: true,
                  artists: { select: { id: true, name: true, avatar: true } },
                },
              },
            },
          },
          playlists: {
            select: {
              addedAt: true,
              playlist: {
                select: {
                  id: true,
                  name: true,
                  cover: true,
                  _count: { select: { tracks: true } },
                  tracks: { select: { track: { select: { cover: true } } }, take: 4 },
                },
              },
            },
          },
        },
      },
    },
  });

  function parseImageSizes(value: unknown): ImageSizes | null {
    if (
      typeof value === "object" &&
      value !== null &&
      "sm" in value &&
      "md" in value &&
      "lg" in value
    ) {
      return value as ImageSizes;
    }
    return null;
  }

  if (!collectionObject || !collectionObject.collection) return [];
  const { albums, playlists } = collectionObject.collection;
  const newCollections: UserCollection[] = [
    ...albums.map(({ album, addedAt }) => {
      const { _count, artists, cover, ...rest } = album;
      return {
        ...rest,
        type: "albums",
        tracksCount: _count.tracks,
        addedAt: addedAt,
        cover: parseImageSizes(cover),
        artists: artists.map((artist) => ({
          ...artist,
          avatar: parseImageSizes(artist.avatar),
        })),
      } as CollectionAlbum;
    }),
    ...playlists.map(({ playlist, addedAt }) => {
      const { _count, tracks, ...rest } = playlist;
      return {
        ...rest,
        type: "playlists",
        tracksCount: _count.tracks,
        addedAt,
        cover: parseImageSizes(playlist.cover),
        tracksCover: tracks.map(({ track }) => parseImageSizes(track.cover)),
      } as CollectionPlaylist;
    }),
    /*  ...tracks.map(({ track, addedAt }) => {
      return {
        ...track,
        type: "tracks",
        addedAt,
        cover: parseImageSizes(track.cover),
        artists: track.artists.map((artist) => {
          return {
            ...artist,
            avatar: parseImageSizes(artist.avatar),
          };
        }),
      } as CollectionTrack;
    }), */
  ].sort((a, b) => +b.addedAt - +a.addedAt);

  return newCollections;
}
export async function togglePlaylistInCollection(playlist: PlaylistDetails) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  const exists = await prisma.collection.findFirst({
    where: { userId, playlists: { some: { playlistId: playlist.id } } },
  });

  if (exists) {
    await prisma.collection.update({
      where: {
        userId,
      },
      data: {
        playlists: { deleteMany: { playlistId: playlist.id } },
      },
    });
  } else {
    await prisma.collection.update({
      where: { userId },
      data: {
        playlists: {
          create: {
            playlistId: playlist.id,
            addedAt: new Date(),
          },
        },
      },
    });
  }
}

export async function getUserAlbumsCollection(): Promise<UserCollection[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];
  const collectionObject = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      collection: {
        select: {
          albums: {
            select: {
              addedAt: true,
              album: {
                select: {
                  id: true,
                  name: true,
                  cover: true,
                  _count: { select: { tracks: true } },
                  artists: { select: { id: true, avatar: true, name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  function parseImageSizes(value: unknown): ImageSizes | null {
    if (
      typeof value === "object" &&
      value !== null &&
      "sm" in value &&
      "md" in value &&
      "lg" in value
    ) {
      return value as ImageSizes;
    }
    return null;
  }

  if (!collectionObject || !collectionObject.collection) return [];
  const { albums } = collectionObject.collection;
  const newCollections: UserCollection[] = albums
    .map(({ album, addedAt }) => {
      const { _count, artists, cover, ...rest } = album;
      return {
        ...rest,
        type: "albums",
        tracksCount: _count.tracks,
        addedAt: addedAt,
        cover: parseImageSizes(cover),
        artists: artists.map((artist) => ({
          ...artist,
          avatar: parseImageSizes(artist.avatar),
        })),
      } as CollectionAlbum;
    })
    .sort((a, b) => +b.addedAt - +a.addedAt);

  return newCollections;
}

export async function getUserTracksCollection(): Promise<UserCollection[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];
  const collectionObject = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      collection: {
        select: {
          tracks: {
            select: {
              addedAt: true,
              track: {
                select: {
                  id: true,
                  name: true,
                  cover: true,
                  artists: { select: { id: true, name: true, avatar: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  function parseImageSizes(value: unknown): ImageSizes | null {
    if (
      typeof value === "object" &&
      value !== null &&
      "sm" in value &&
      "md" in value &&
      "lg" in value
    ) {
      return value as ImageSizes;
    }
    return null;
  }

  if (!collectionObject || !collectionObject.collection) return [];
  const { tracks } = collectionObject.collection;
  const newCollections: UserCollection[] = tracks
    .map(({ track, addedAt }) => {
      return {
        ...track,
        type: "tracks",
        addedAt,
        cover: parseImageSizes(track.cover),
        artists: track.artists.map((artist) => {
          return {
            ...artist,
            avatar: parseImageSizes(artist.avatar),
          };
        }),
      } as CollectionTrack;
    })
    .sort((a, b) => +b.addedAt - +a.addedAt);

  return newCollections;
}

export async function getUserPlaylistsCollection(): Promise<UserCollection[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return [];
  const collectionObject = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      collection: {
        select: {
          playlists: {
            select: {
              addedAt: true,
              playlist: {
                select: {
                  id: true,
                  name: true,
                  cover: true,
                  _count: { select: { tracks: true } },
                  tracks: { select: { track: { select: { cover: true } } }, take: 4 },
                },
              },
            },
          },
        },
      },
    },
  });

  function parseImageSizes(value: unknown): ImageSizes | null {
    if (
      typeof value === "object" &&
      value !== null &&
      "sm" in value &&
      "md" in value &&
      "lg" in value
    ) {
      return value as ImageSizes;
    }
    return null;
  }

  if (!collectionObject || !collectionObject.collection) return [];
  const { playlists } = collectionObject.collection;
  const newCollections: UserCollection[] = playlists
    .map(({ playlist, addedAt }) => {
      const { _count, tracks, ...rest } = playlist;
      return {
        ...rest,
        type: "playlists",
        tracksCount: _count.tracks,
        addedAt,
        cover: parseImageSizes(playlist.cover),
        tracksCover: tracks.map(({ track }) => parseImageSizes(track.cover)),
      } as CollectionPlaylist;
    })
    .sort((a, b) => +b.addedAt - +a.addedAt);

  return newCollections;
}
