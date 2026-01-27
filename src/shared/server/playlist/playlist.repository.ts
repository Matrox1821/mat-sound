"use server";

import { ImageSizes } from "@shared-types/common.types";
import { prisma } from "@config/db";

export const getPlaylists = async (
  limit: number,
): Promise<
  {
    type: string;
    id: string;
    name: string;
    cover: ImageSizes;
  }[]
> => {
  return (await prisma.playlist.findMany({
    take: limit,
    select: { id: true, name: true, cover: true },
  })) as unknown as {
    type: string;
    id: string;
    name: string;
    cover: ImageSizes;
  }[];
};
