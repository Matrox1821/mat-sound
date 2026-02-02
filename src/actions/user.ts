"use server";

import { auth } from "@/lib/auth";
import { ImageSizes } from "@shared-types/common.types";
import { prisma } from "@config/db";
import { headers } from "next/headers";
import { parseUpdatedUserFormData } from "@/shared/formData/userForm";
import { handleAvatarUpload } from "@/shared/server/user/user.storage";
import {
  CollectionAlbum,
  CollectionPlaylist,
  CollectionTrack,
  UserCollection,
} from "@/types/user.types";

export async function createPlaylist(name: string, trackId?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autorizado");

  const userId = session.user.id;

  if (trackId) {
    const newPlaylist = await prisma.playlist.create({
      data: { name, tracks: { create: { trackId: trackId } }, userId, createdAt: new Date() },
      select: { id: true, name: true },
    });

    await prisma.collection.upsert({
      where: { userId },
      update: {
        playlists: { create: { playlistId: newPlaylist.id, addedAt: new Date() } },
      },
      create: {
        userId,
        playlists: { create: { playlistId: newPlaylist.id, addedAt: new Date() } },
      },
    });
    return newPlaylist;
  }
  const newPlaylist = await prisma.playlist.create({
    data: { name, userId, createdAt: new Date() },
  });

  return newPlaylist;
}

export async function updateUserServer(currentState: any, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  const newUser = parseUpdatedUserFormData(formData);
  try {
    if (!session?.user || !newUser) throw new Error("Unauthorized");
    const userId = session.user.id;
    const exists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!exists) {
      if (!session?.user || !newUser) throw new Error("Ek usuario no existe o no esta logueado");
    }
    const avatar = await handleAvatarUpload(newUser.avatar, userId);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(newUser.biography && { biography: newUser.biography }),
        ...(newUser.displayUsername && { displayUsername: newUser.displayUsername }),
        ...(newUser.avatar && avatar && { avatar: avatar.dbPath }),
        updatedAt: new Date(),
      },
    });
    return { success: true, errors: [] };
  } catch (error: any) {
    return { errors: [{ message: error.message }], success: false };
  }
}

/////////////
export async function getUserLikedTrackIds() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return [];
  }

  const likes = await prisma.like.findMany({
    where: { userId: session.user.id },
    select: { trackId: true },
  });

  return likes.map((l) => l.trackId);
}

export async function toggleLike(trackId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  const userId = session.user.id;

  const userCollection = await prisma.collection.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!userCollection) throw new Error("Unauthorized");

  const exists = await prisma.like.findUnique({
    where: {
      userId_trackId: {
        userId,
        trackId,
      },
    },
  });

  if (exists) {
    await prisma.like.delete({
      where: {
        userId_trackId: { userId, trackId },
      },
    });
    await prisma.trackOnCollection.delete({
      where: {
        trackId_collectionId: {
          collectionId: userCollection.id,
          trackId,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: { userId, trackId, likedAt: new Date() },
    });
    await prisma.trackOnCollection.create({
      data: {
        collectionId: userCollection.id,
        trackId,
        addedAt: new Date(),
      },
    });
  }
}

export async function getUserPlaylists(): Promise<
  {
    id: string;
    name: string;
    cover?: ImageSizes | null;
    tracks: { id: string; cover: ImageSizes }[];
  }[]
> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return [];
  }

  const playlists = await prisma.playlist.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      cover: true,
      tracks: { select: { track: { select: { id: true, cover: true } } } },
    },
  });

  return playlists.map((p) => ({
    id: p.id,
    name: p.name,
    cover: p.cover,
    tracks: p.tracks.map(({ track }) => ({ id: track.id, cover: track.cover })),
  })) as unknown as {
    id: string;
    name: string;
    cover?: ImageSizes | null;
    tracks: { id: string; cover: ImageSizes }[];
  }[];
}

export async function togglePlaylist(playlistId: string, trackId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId },
  });
  if (!playlist) throw new Error("Forbidden");

  const exists = await prisma.playlist.findUnique({
    where: {
      id: playlistId,
      tracks: { some: { trackId: trackId } },
    },
  });

  if (exists) {
    await prisma.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        tracks: { deleteMany: { trackId: trackId } },
      },
    });
  } else {
    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        tracks: {
          create: {
            trackId,
            addedAt: new Date(),
          },
        },
      },
    });
  }
}

export async function getUserArtistFollowingIds() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return [];
  }

  const follow = await prisma.follow.findMany({
    where: { userId: session.user.id },
    select: { artistId: true },
  });

  return follow.map((f) => f.artistId);
}

export async function toggleFollow(artistId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  const exists = await prisma.follow.findUnique({
    where: {
      userId_artistId: {
        userId,
        artistId,
      },
    },
  });

  if (exists) {
    await prisma.follow.delete({
      where: {
        userId_artistId: { userId, artistId },
      },
    });
  } else {
    await prisma.follow.create({
      data: { userId, artistId, followedAt: new Date() },
    });
  }
}

export async function getUserAvatar() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return {
      updatedAt: new Date(),
      avatar: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true, updatedAt: true },
  });

  return user;
}

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
  const { albums, playlists, tracks } = collectionObject.collection;
  const newCollections: UserCollection[] = [
    ...albums.map(({ album, addedAt }) => {
      const { _count, artists, cover, ...rest } = album;
      return {
        ...rest,
        type: "album",
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
        type: "playlist",
        tracksCount: _count.tracks,
        addedAt,
        cover: parseImageSizes(playlist.cover),
        tracksCover: tracks.map(({ track }) => parseImageSizes(track.cover)),
      } as CollectionPlaylist;
    }),
    ...tracks.map(({ track, addedAt }) => {
      return {
        ...track,
        type: "track",
        addedAt,
        cover: parseImageSizes(track.cover),
        artists: track.artists.map((artist) => {
          return {
            ...artist,
            avatar: parseImageSizes(artist.avatar),
          };
        }),
      } as CollectionTrack;
    }),
  ].sort((a, b) => +b.addedAt - +a.addedAt);

  return newCollections;
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
        type: "album",
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
        type: "track",
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
        type: "playlist",
        tracksCount: _count.tracks,
        addedAt,
        cover: parseImageSizes(playlist.cover),
        tracksCover: tracks.map(({ track }) => parseImageSizes(track.cover)),
      } as CollectionPlaylist;
    })
    .sort((a, b) => +b.addedAt - +a.addedAt);

  return newCollections;
}
