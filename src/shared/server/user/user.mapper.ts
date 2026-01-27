import { UserPlaylistRepository } from "@shared-types/playlist.types";
import { PlaylistCard, TrackCard, UserFavoritesRepository } from "@shared-types/user.types";

export const mapPlaylistsToMediaCard = ({
  username,
  userPlaylists,
}: {
  username: string;
  userPlaylists: UserPlaylistRepository;
}): PlaylistCard[] => {
  return userPlaylists.playlists.map((playlist) => ({
    type: "playlist",
    id: playlist.id,
    title: playlist.name,
    image: playlist.cover,
    images: playlist.tracks.map(({ track }) => track.cover),
    href: `/user/${username}/playlists/${playlist.id}`,
  }));
};

export const mapFavoritesToMediaCard = ({
  username,
  userFavorites,
}: {
  username: string;
  userFavorites: UserFavoritesRepository;
}): TrackCard[] => {
  return userFavorites.likes.map(({ track }) => ({
    type: "track",
    id: track.id,
    title: track.name,
    image: track.cover,
    artists: track.artists.map(({ id, name, avatar }) => ({
      id,
      name,
      avatar,
    })),
    href: `/user/${username}/tracks/${track.id}`,
    duration: track.duration,
    lyrics: track.lyrics,
    reproductions: track.reproductions,
    likes: track._count.likes,
  }));
};
