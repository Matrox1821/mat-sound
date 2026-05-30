"use server";
import { getUserCollection, getUserFavorites, getUserPlaylists } from "./user.repository";
import { mapFavoritesToMediaCard, mapPlaylistsToMediaCard } from "./user.mapper";
import {
  AlbumDetails,
  CollectionService,
  PlaylistDetails,
  TrackDetails,
} from "@shared-types/user.types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MediaCard } from "@/types/content.types";
import { asImageSizes } from "@/shared/utils/helpers";

export const getPlaylistsToUserContent = async ({
  username,
}: {
  username: string;
}): Promise<MediaCard[] | null> => {
  const playlists = await getUserPlaylists({ username });
  if (!playlists) return null;
  return mapPlaylistsToMediaCard({ userPlaylists: playlists });
};

export const getFavoritesToUserContent = async ({ username }: { username: string }) => {
  const favorites = await getUserFavorites({ username });
  if (!favorites) return null;
  return mapFavoritesToMediaCard({ userFavorites: favorites });
};

export const getCollection = async (): Promise<CollectionService | null> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return null;
  }
  const collection = await getUserCollection(session?.user.id);

  const trackMap: Map<string, TrackDetails> = new Map();
  collection?.tracks.map(({ track, addedAt }) =>
    trackMap.set(track.id, {
      id: track.id,
      cover: track.cover,
      name: track.name,
      artists: track.artists.map(({ id, name }) => ({ id, name })),
      addedAt,
    }),
  );
  const playlistMap: Map<string, PlaylistDetails> = new Map();
  collection?.playlists.map(({ playlist, addedAt }) => {
    playlistMap.set(playlist.id, {
      id: playlist.id,
      name: playlist.name,
      cover: playlist.cover,
      tracks: playlist.tracks.map(({ track }) => {
        const { _count, cover, albums, artists, ...rest } = track;
        return {
          ...rest,
          likes: _count.likes,
          cover: asImageSizes(cover),
          albums: albums.map(({ album }) => ({ name: album.name, id: album.id })),
          artists: artists.map(({ avatar, id, name }) => ({
            avatar: asImageSizes(avatar),
            id,
            name,
          })),
        };
      }),
      addedAt,
    });
  });
  const albumMap: Map<string, AlbumDetails> = new Map();
  collection?.albums.map(({ album, addedAt }) => {
    albumMap.set(album.id, {
      id: album.id,
      name: album.name,
      artists: album?.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      })),
      cover: album.cover,
      tracks: album.tracks.map(({ track }) => {
        const { _count, cover, albums, artists, ...rest } = track;
        return {
          ...rest,
          likes: _count.likes,
          cover: asImageSizes(cover),
          albums: albums.map(({ album }) => ({ name: album.name, id: album.id })),
          artists: artists.map(({ avatar, id, name }) => ({
            avatar: asImageSizes(avatar),
            id,
            name,
          })),
        };
      }),
      addedAt,
    });
  });
  return {
    tracks: trackMap,
    albums: albumMap,
    playlists: playlistMap,
  };
};

export const getFavorites = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user.username) return null;
  const userLibrary = await getUserFavorites({ username: session.user.username });

  return userLibrary;
};
