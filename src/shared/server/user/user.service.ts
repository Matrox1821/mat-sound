"use server";
import { CustomError } from "@shared-types/error.type";
import { getUserCollection, getUserFavorites, getUserPlaylists } from "./user.repository";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
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

export const getPlaylistsToUserContent = async ({
  username,
}: {
  username: string;
}): Promise<MediaCard[]> => {
  const playlists = await getUserPlaylists({ username });
  if (!playlists) {
    throw new CustomError({
      errors: [
        {
          message: "No artists were found to display in the content section.",
        },
      ],
      msg: "Empty artist list",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }
  return mapPlaylistsToMediaCard({ userPlaylists: playlists });
};

export const getFavoritesToUserContent = async ({ username }: { username: string }) => {
  const favorites = await getUserFavorites({ username });
  if (!favorites) {
    throw new CustomError({
      errors: [
        {
          message: "No artists were found to display in the content section.",
        },
      ],
      msg: "Empty artist list",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }
  return mapFavoritesToMediaCard({ userFavorites: favorites });
};

export const getCollection = async (): Promise<CollectionService | null> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return null;
  }
  const collection = await getUserCollection(session?.user.id);

  const trackMap: Map<string, TrackDetails> = new Map();
  collection?.tracks.map(({ track }) =>
    trackMap.set(track.id, {
      id: track.id,
      cover: track.cover,
      name: track.name,
      artists: track.artists.map(({ id, name }) => ({ id, name })),
    }),
  );
  const playlistMap: Map<string, PlaylistDetails> = new Map();
  collection?.playlists.map(({ playlist }) => {
    playlistMap.set(playlist.id, {
      id: playlist.id,
      name: playlist.name,
      cover: playlist.cover,
      tracks: playlist?.tracks.map(({ track }) => ({
        id: track.id,
        cover: track.cover,
        name: track.name,
        artists: track.artists.map(({ id, name }) => ({ id, name })),
      })),
    });
  });
  const albumMap: Map<string, AlbumDetails> = new Map();
  collection?.albums.map(({ album }) => {
    albumMap.set(album.id, {
      id: album.id,
      name: album.name,
      artists: album?.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      })),
      cover: album.cover,
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
