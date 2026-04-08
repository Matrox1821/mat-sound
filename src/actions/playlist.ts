"use server";

import { auth } from "@/lib/auth";
import { parseUpdatedPlaylistFormData } from "@/shared/formData/playlistForm";
import { handleCoverUpload } from "@/shared/server/playlist/playlist.storage";
import { prisma } from "@config/db";
import { headers } from "next/headers";

export async function updatePlaylistServer(currentState: any, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  const playlist = parseUpdatedPlaylistFormData(formData);
  try {
    if (!session?.user || !playlist) throw new Error("Unauthorized");
    const userId = session.user.id;
    const exists = await prisma.playlist.findUnique({
      where: {
        id: playlist.id,
      },
    });

    if (!exists || exists.userId !== userId) {
      throw new Error("El usuario no puede editar esta playlist.");
    }
    const cover = await handleCoverUpload(playlist.cover, userId);
    await prisma.playlist.update({
      where: {
        id: playlist.id,
      },
      data: {
        ...(playlist.name && { name: playlist.name }),
        ...(playlist.cover &&
          cover && {
            cover: cover.dbPath as { sm: string; md: string; lg: string },
          }),
        updatedAt: new Date(),
      },
    });
    return { success: true, errors: [] };
  } catch (error: any) {
    console.log(error);
    return { errors: [{ message: error.message }], success: false };
  }
}
