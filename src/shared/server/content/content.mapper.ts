import { AlbumBase } from "@/types/album.types";
import { ArtistBase } from "@/types/artist.types";
import { ImageSizes } from "@/types/common.types";

export const mapArtistsToContent = (
  artists: ArtistBase[],
): {
  type: "artists";
  name: string;
  id: string;
  avatar: ImageSizes | null;
}[] => {
  return artists.map((artist) => ({
    ...artist,
    type: "artists",
  }));
};

export const mapAlbumsToContent = (
  albums: AlbumBase[],
): {
  type: "albums";
  name: string;
  id: string;
  cover: ImageSizes | null;
}[] => {
  return albums.map((album) => ({ ...album, type: "albums" }));
};
export const mapPlaylistsToContent = (
  playlists: {
    name: string;
    id: string;
    cover: ImageSizes | null;
  }[],
): {
  type: "playlists";
  name: string;
  id: string;
  cover: ImageSizes | null;
}[] => {
  return playlists.map((playlist) => ({ ...playlist, type: "playlists" }));
};

export const mapTrackToContent = (track: any, userId?: string, userPlaylists?: any) => {
  return {
    ...track,
    type: "tracks",
    isLiked: userId ? track.likes.length > 0 : false,
    likes: undefined, // Limpiamos para no enviar basura al cliente
    userPlaylists: userPlaylists?.playlists.map((playlist: any) => ({
      ...playlist,
      isInPlaylist: playlist.tracks.some((t: any) => t.track.id === track.id),
      tracks: undefined, // No necesitamos enviar todos los tracks de la playlist aquí
    })),
  };
};
