"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@config/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function toggleLikeAction(trackId: string, shouldLike: boolean, pathname: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autorizado");

  const userId = session.user.id;

  if (shouldLike) {
    await prisma.like.create({
      data: { trackId: trackId, userId: userId },
    });
  } else {
    await prisma.like.delete({
      where: {
        userId_trackId: { userId: userId, trackId: trackId },
      },
    });
  }
  revalidatePath(pathname);
}

export async function createPlaylist(trackId: string, name: string, pathname: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autorizado");

  const userId = session.user.id;

  if (trackId) {
    const newPlaylist = await prisma.playlist.create({
      data: { name, tracks: { create: { trackId: trackId } }, userId },
    });
    await prisma.collection.upsert({
      where: { userId },
      update: {
        playlists: { create: { playlistId: newPlaylist.id } },
      },
      create: {
        userId,
        playlists: { create: { playlistId: newPlaylist.id } },
      },
    });
  }
  revalidatePath(pathname);
}

export async function togglePlaylist(
  playlistId: string,
  trackId: string,
  shouldSave: boolean,
  pathname: string
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autorizado");

  const userId = session.user.id;

  if (shouldSave) {
    await prisma.playlist.update({
      where: { userId: userId, id: playlistId },
      data: { tracks: { create: { trackId: trackId } } },
    });
  } else {
    await prisma.trackOnPlaylist.delete({
      where: {
        trackId_playlistId: {
          playlistId: playlistId,
          trackId: trackId,
        },
      },
    });
  }
  revalidatePath(pathname);
}
