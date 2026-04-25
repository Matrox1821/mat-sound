"use server";

import { UserPlaylistRepository } from "@shared-types/playlist.types";
import { CollectionRepository, UserFavoritesRepository } from "@shared-types/user.types";
import { prisma } from "@config/db";
import { trackFullSelect } from "../track/track.select";

export const getUserPlaylists = async ({
  username = "",
}: {
  username: string;
}): Promise<UserPlaylistRepository | null> => {
  if (username === "") return null;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return null;

    const response = await prisma.collection.findUnique({
      where: { userId: user.id },
      select: {
        playlists: {
          select: {
            playlist: {
              select: {
                id: true,
                cover: true,
                name: true,
                tracks: { select: { track: { select: trackFullSelect } } },
                user: { select: { username: true, displayUsername: true, avatar: true } },
              },
            },
          },
          orderBy: {
            addedAt: "asc",
          },
        },
      },
    });
    return response as unknown as UserPlaylistRepository;
  } catch {
    return null;
  }
};

export const getUserFavorites = async ({
  username = "",
}: {
  username: string;
}): Promise<UserFavoritesRepository | null> => {
  if (username === "") return null;
  try {
    const response = await prisma.user.findUnique({
      where: { username },
      select: {
        likes: {
          include: {
            track: {
              select: trackFullSelect,
            },
          },
          take: 12,
          orderBy: {
            likedAt: "asc",
          },
        },
      },
    });
    return response as unknown as UserFavoritesRepository | null;
  } catch {
    return null;
  }
};

export const getUserCollection = async (userId: string): Promise<CollectionRepository> => {
  return (await prisma.collection.findUnique({
    where: { userId },
    select: {
      id: true,
      tracks: {
        select: {
          track: {
            select: {
              id: true,
              name: true,
              cover: true,
              artists: { select: { id: true, name: true } },
            },
          },
          addedAt: true,
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
              tracks: {
                take: 4,
                select: {
                  track: {
                    select: {
                      id: true,
                      name: true,
                      cover: true,
                      artists: { select: { id: true, name: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      albums: {
        select: {
          addedAt: true,
          album: {
            select: {
              id: true,
              cover: true,
              name: true,
              artists: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  })) as unknown as CollectionRepository;
};
