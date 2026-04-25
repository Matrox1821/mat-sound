"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@config/db";
import { headers } from "next/headers";

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
      data: { userId, artistId, followedAt: new Date() },
    });
  }
}
