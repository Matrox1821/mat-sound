import { ImageSizes } from "@/types/common.types";
import { PlaylistCard, TrackCard } from "@/types/content.types";
import { JsonValue } from "@prisma/client/runtime/client";
import { UserPlaylistRepository } from "@shared-types/playlist.types";
import { UserFavoritesRepository } from "@shared-types/user.types";
export const asImageSizes = (value: JsonValue): ImageSizes | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as unknown as ImageSizes;
};
export const mapPlaylistsToMediaCard = ({
  userPlaylists,
}: {
  userPlaylists: UserPlaylistRepository;
}): PlaylistCard[] => {
  return userPlaylists.playlists.map(({ playlist }) => ({
    type: "playlists",
    id: playlist.id,
    title: playlist.name,
    image: asImageSizes(playlist.cover),
    images: playlist.tracks
      .map(({ track }) => track.cover)
      .filter((c): c is ImageSizes => c !== null),
    href: `/playlists/${playlist.id}`,
    tracks: playlist.tracks.map(({ track }) => track),
    user: {
      avatar: playlist.user.avatar,
      name: playlist.user.displayUsername,
      username: playlist.user.username,
    },
  }));
};

export const mapFavoritesToMediaCard = ({
  userFavorites,
}: {
  userFavorites: UserFavoritesRepository;
}): TrackCard[] => {
  return userFavorites.likes.map(({ track }) => ({
    type: "tracks",
    id: track.id,
    title: track.name,
    image: track.cover,
    artists: track.artists.map(({ id, name, avatar }) => ({
      id,
      name,
      avatar,
    })),
    name: track.name,
    song: track.song || "",

    href: `/tracks/${track.id}`,
    duration: track.duration,
    lyrics: track.lyrics,
    reproductions: track.reproductions,
    likes: track._count.likes,
  }));
};
