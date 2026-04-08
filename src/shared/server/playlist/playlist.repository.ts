"use server";

import { PlaylistRepository } from "@/types/playlist.types";
import { prisma } from "@config/db";

export const getPlaylistById = async (id: string): Promise<PlaylistRepository> => {
  return (await prisma.playlist.findUnique({
    where: { id: id },
    select: {
      id: true,
      name: true,
      cover: true,
      _count: { select: { tracks: true } },
      tracks: {
        select: {
          addedAt: true,
          track: {
            select: {
              id: true,
              name: true,
              cover: true,
              artists: { select: { id: true, avatar: true, name: true } },
              reproductions: true,
              duration: true,
              song: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
      user: { select: { id: true, displayUsername: true, avatar: true, username: true } },
    },
  })) as unknown as PlaylistRepository;
};
