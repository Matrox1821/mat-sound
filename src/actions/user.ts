"use server";

import { auth } from "@/lib/auth"; // Tu config de Better Auth
import { prisma } from "@config/db";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function toggleLikeAction(trackId: string, shouldLike: boolean, pathname: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autorizado");

  const userId = session.user.id;

  if (shouldLike) {
    await prisma.like.create({
      data: { track_id: trackId, user_id: userId },
    });
  } else {
    await prisma.like.delete({
      where: {
        user_id_track_id: { user_id: userId, track_id: trackId },
      },
    });
  }
  revalidatePath(pathname);
}

export async function createPlaylist(trackId: string, name: string, pathname: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autorizado");

  const userId = session.user.id;

  const playlistUUID = randomUUID();

  if (trackId) {
    await prisma.playlist.create({
      data: { name, tracks: { create: { track_id: trackId } }, user_id: userId, id: playlistUUID },
    });
  } else {
    await prisma.playlist.delete({
      where: {
        user_id: userId,
        tracks: { some: { track_id: trackId } },
        name: name,
        id: playlistUUID,
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
      where: { user_id: userId, id: playlistId },
      data: { tracks: { create: { track_id: trackId } } },
    });
  } else {
    await prisma.trackOnPlaylist.delete({
      where: {
        track_id_playlist_id: {
          playlist_id: playlistId,
          track_id: trackId,
        },
      },
    });
  }
  revalidatePath(pathname);
}
