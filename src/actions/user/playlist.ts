"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { prisma } from "@config/db";
import { ImageSizes } from "@/types/common.types";
import { playerTrackProps } from "@/types/track.types";
import { trackFullSelect } from "@/shared/server/track/track.select";
import { asImageSizes } from "@/shared/utils/helpers";

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
    tracks: playerTrackProps[];
    addedAt: Date;
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
      tracks: { select: { track: { select: trackFullSelect } } },
      createdAt: true,
    },
  });
  return playlists.map((p) => ({
    id: p.id,
    name: p.name,
    cover: p.cover,
    tracks:
      p.tracks?.map(({ track }) => {
        const { cover, _count, artists, albums, ...rest } = track;
        return {
          ...rest,
          cover: asImageSizes(cover),
          likes: _count.likes,
          artists: artists.map(({ id, name, avatar }) => ({
            id,
            name,
            avatar: asImageSizes(avatar),
          })),
          albums: albums.map(({ album }) => ({
            id: album.id,
            name: album.name,
          })),
        };
      }) ?? null,
    addedAt: p.createdAt,
  })) as unknown as {
    id: string;
    name: string;
    cover?: ImageSizes | null;
    tracks: playerTrackProps[];
    addedAt: Date;
  }[];
}

export async function deletePlaylist(playlistId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId },
  });

  if (!playlist) throw new Error("Forbidden");

  await prisma.playlist.delete({
    where: { id: playlistId },
  });
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
