"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@config/db";
import { headers } from "next/headers";
import { parseUpdatedUserFormData } from "@/shared/formData/userForm";
import { handleAvatarUpload } from "@/shared/server/user/user.storage";

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
      if (!session?.user || !newUser) throw new Error("El usuario no existe o no esta logueado");
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
        updatedAt: new Date(),
      },
    });
    return { success: true, errors: [] };
  } catch (error: any) {
    return { errors: [{ message: error.message }], success: false };
  }
}

export async function getUserAvatar() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return {
      updatedAt: new Date(),
      avatar: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatar: true, updatedAt: true },
  });

  return user;
}
