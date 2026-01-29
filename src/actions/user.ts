"use server";

import { auth } from "@/lib/auth";
import { ImageSizes } from "@shared-types/common.types";
import { prisma } from "@config/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { parseUpdatedUserFormData } from "@/shared/formData/userForm";
import { handleAvatarUpload } from "@/shared/server/user/user.storage";

export async function createPlaylist(name: string, trackId?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("No autorizado");

  const userId = session.user.id;

  if (trackId) {
    const newPlaylist = await prisma.playlist.create({
      data: { name, tracks: { create: { trackId: trackId } }, userId },
      select: { id: true, name: true },
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
    return newPlaylist;
  }
  const newPlaylist = await prisma.playlist.create({
    data: { name, userId },
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

export async function toggleLike(trackId: string, pathname: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

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
  } else {
    await prisma.like.create({
      data: { userId, trackId },
    });
  }
  revalidatePath(pathname);
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
      data: { userId, artistId },
    });
  }
}
