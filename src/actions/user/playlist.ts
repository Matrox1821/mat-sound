"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { prisma } from "@config/db";
import { ImageSizes } from "@/types/common.types";

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
