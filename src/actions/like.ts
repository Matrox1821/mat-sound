"use server";

import { auth } from "@/lib/auth"; // Tu config de Better Auth
import { prisma } from "@config/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function toggleLikeAction(trackId: string, shouldLike: boolean) {
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

  // Esto limpia la caché de Next.js y actualiza los datos reales
  revalidatePath(`/user/${session.user.username}`);
}
