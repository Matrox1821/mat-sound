"use server";

import { UserPlaylistRepository } from "@shared-types/playlist.types";
import { UserFavoritesRepository } from "@shared-types/user.types";
import { prisma } from "@config/db";

export const getUserPlaylists = async ({
  username = "",
}: {
  username: string;
}): Promise<UserPlaylistRepository | null> => {
  if (username === "") return null;
  try {
    const response = await prisma.user.findUnique({
      where: { username },
      select: {
        playlists: {
          select: {
            id: true,
            cover: true,
            name: true,
            tracks: {
              select: { track: { select: { id: true, cover: true } } },
              take: 4,
            },
          },
          orderBy: {
            createdAt: "asc",
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
              select: {
                id: true,
                name: true,
                cover: true,
                song: true,
                duration: true,
                lyrics: true,
                reproductions: true,
                _count: {
                  select: { likes: true },
                },
                artists: { select: { id: true, avatar: true, name: true } },
              },
            },
          },
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
