import { ArtistBase } from "@/types/artist.types";
import {
  MappedArtistService,
  MappedAlbumService,
  MappedTrackService,
  TrackWithRelationsRepo,
  PlaylistRepo,
  PlaylistService,
  AlbumWithArtistsRepo,
} from "@/types/content.types";

export const mapArtistsToContent = (artists: ArtistBase[]): MappedArtistService[] => {
  return artists.map((artist) => ({
    ...artist,
    type: "artists",
  }));
};

export const mapAlbumsToContent = (albums: AlbumWithArtistsRepo[]): MappedAlbumService[] => {
  return albums.map((album) => ({ ...album, type: "albums" }));
};

export const mapPlaylistToContent = (playlists: PlaylistRepo[]): PlaylistService[] => {
  return playlists.map(({ cover, tracks, ...newPlaylist }) => ({
    ...newPlaylist,
    type: "playlists",
    image: cover,
    tracks: tracks?.map(({ track }) => track.cover),
  }));
};

export const mapTrackToContent = (
  { _count, ...track }: TrackWithRelationsRepo,
  userPlaylists: PlaylistService[] | null,
): MappedTrackService => {
  return {
    ...track,
    type: "tracks",
    isLiked: !!track.likes,
    likes: _count.likes || 0,
    userPlaylists: userPlaylists?.map(({ tracks, ...playlist }) => ({
      ...playlist,
      isInPlaylist: tracks?.some((t: any) => t.track.id === track.id) || false,
    })),
  };
};
