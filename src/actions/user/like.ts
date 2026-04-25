"use server";
import { auth } from "@/lib/auth";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { getTracksByRecomendations } from "@/shared/server/track/track.service";
import { prisma } from "@config/db";
import { headers } from "next/headers";

export async function getUserLikedTracks() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return [];
  }

  const likes = await prisma.like.findMany({
    where: { userId: session.user.id },
    select: {
      track: {
        select: {
          cover: true,
          duration: true,
          genres: true,
          id: true,
          lyrics: true,
          name: true,
          reproductions: true,
          releaseDate: true,
          song: true,
          albums: { include: { album: true } },
          artists: { select: { name: true, id: true, avatar: true } },
        },
      },
    },
  });

  return likes.map(({ track }) => parseTrackByPlayer(track));
}

export async function toggleLike(trackId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  const userId = session.user.id;

  const userCollection = await prisma.collection.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!userCollection) throw new Error("Unauthorized");

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
    await prisma.trackOnCollection.delete({
      where: {
        trackId_collectionId: {
          collectionId: userCollection.id,
          trackId,
        },
      },
    });
  } else {
    await prisma.$transaction([
      prisma.like.create({ data: { userId, trackId } }),
      prisma.trackOnCollection.create({
        data: { collectionId: userCollection.id, trackId },
      }),
    ]);
  }
}

export async function getUpcomingTracksAction(excludeIds: string[]) {
  try {
    const allRecommendations = await getTracksByRecomendations({
      limit: 20,
      excludeId: excludeIds,
    });

    const filtered = allRecommendations;

    return { success: true, data: filtered };
  } catch {
    return { success: false, error: "Error al obtener recomendaciones" };
  }
}
