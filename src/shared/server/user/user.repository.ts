"use server";

import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { prisma } from "@config/db";

export const getUserPlaylists = async ({ userId = "" }: { userId: string }) => {
  if (userId === "") return;

  const response = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      playlists: {
        select: {
          id: true,
          name: true,
          cover: true,
          tracks: { select: { track: { select: { id: true, cover: true } } } },
        },
      },
    },
  });
  if (!response)
    throw new CustomError({
      errors: [
        {
          message: "Track not found.",
        },
      ],
      msg: "Track not found.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  return response;
};
