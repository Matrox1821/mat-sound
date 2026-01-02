"use server";

import { prisma } from "@config/db";

export const getPlaylists = async (limit: number) => {
  const playlists = await prisma.playlist.findMany({
    take: limit,
    select: { id: true, name: true, images: true },
  });
  return playlists.map((playlist) => ({ ...playlist, type: "playlists" }));
};
