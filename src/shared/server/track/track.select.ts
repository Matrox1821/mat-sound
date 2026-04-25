import { Prisma } from "../../../../generated/prisma/client";

export const trackFullSelect = {
  id: true,
  name: true,
  cover: true,
  song: true,
  duration: true,
  reproductions: true,
  releaseDate: true,
  lyrics: true,
  _count: { select: { likes: true } },
  artists: {
    select: { name: true, id: true, avatar: true },
  },
  albums: {
    select: {
      order: true,
      disk: true,
      album: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.TrackSelect;

export type TrackFull = Prisma.TrackGetPayload<{ select: typeof trackFullSelect }>;
