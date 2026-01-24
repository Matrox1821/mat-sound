"use server";

import { UserPlaylistRepository } from "@/types/playlist.types";
import { prisma } from "@config/db";

export const getUserPlaylists = async ({
  userId = "",
}: {
  userId: string;
}): Promise<UserPlaylistRepository[] | null> => {
  if (userId === "") return null;
  try {
    const response = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        playlists: {
          select: {
            id: true,
            name: true,
            cover: true,
            tracks: { select: { track: { select: { id: true, cover: true } } } },
          },
        },
      },
    });
    return response as unknown as UserPlaylistRepository[];
  } catch {
    return null;
  }
};
