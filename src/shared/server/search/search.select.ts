import { Prisma } from "../../../../generated/prisma/client";
import { trackFullSelect } from "../track/track.select";

export const artistWithTracksSelect = {
  id: true,
  name: true,
  avatar: true,
  tracks: {
    orderBy: { reproductions: "desc" },
    take: 20,
    select: trackFullSelect,
  },
} satisfies Prisma.ArtistSelect;
export const albumWithTracksSelect = {
  id: true,
  name: true,
  cover: true,
  releaseDate: true,
  artists: { select: { id: true, name: true, avatar: true } },
  tracks: {
    orderBy: { order: "asc" },
    take: 20,
    select: { order: true, track: { select: trackFullSelect } },
  },
} satisfies Prisma.AlbumSelect;

export const playlistWithTracksSelect = {
  id: true,
  name: true,
  cover: true,
  user: { select: { username: true, name: true, avatar: true } },
  tracks: {
    take: 20,
    select: { track: { select: trackFullSelect } },
  },
} satisfies Prisma.PlaylistSelect;

export type ArtistWithTracks = Prisma.ArtistGetPayload<{ select: typeof artistWithTracksSelect }>;
export type AlbumWithTracks = Prisma.AlbumGetPayload<{ select: typeof albumWithTracksSelect }>;
export type PlaylistWithTracks = Prisma.PlaylistGetPayload<{
  select: typeof playlistWithTracksSelect;
}>;
export type SearchEntity = "tracks" | "artists" | "albums" | "playlists" | "all";
