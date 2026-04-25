import { Prisma } from "../../../../generated/prisma/client";
import { trackFullSelect } from "../track/track.select";

export const albumContentSelect = {
  id: true,
  name: true,
  cover: true,
  artists: {
    select: { id: true, name: true, avatar: true },
  },
  tracks: { select: { track: { select: trackFullSelect } } },
} satisfies Prisma.AlbumSelect;

export const playlistContentSelect = {
  id: true,
  name: true,
  cover: true,
  tracks: {
    take: 4,
    select: {
      track: {
        select: trackFullSelect,
      },
    },
  },
  user: { select: { avatar: true, displayUsername: true, username: true } },
} satisfies Prisma.PlaylistSelect;

export const artistContentSelect = {
  id: true,
  name: true,
  avatar: true,
  tracks: { select: trackFullSelect, orderBy: { reproductions: "asc" }, take: 20 },
} satisfies Prisma.ArtistSelect;

export type AlbumContentRaw = Prisma.AlbumGetPayload<{ select: typeof albumContentSelect }>;
export type PlaylistContentRaw = Prisma.PlaylistGetPayload<{
  select: typeof playlistContentSelect;
}>;
export type ArtistContentRaw = Prisma.ArtistGetPayload<{ select: typeof artistContentSelect }>;
