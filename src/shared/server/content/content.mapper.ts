import { ArtistBase } from "@shared-types/artist.types";
import {
  ArtistContentService,
  AlbumContentService,
  TrackContentService,
  TrackContentRepository,
  AlbumContentRepository,
  PlaylistContentService,
  PlaylistContentRepository,
} from "@shared-types/content.types";

export const mapArtistsToContent = (artists: ArtistBase[]): ArtistContentService[] => {
  return artists.map((artist) => ({
    ...artist,
    type: "artists",
  }));
};

export const mapAlbumsToContent = (albums: AlbumContentRepository[]): AlbumContentService[] => {
  return albums.map((album) => ({ ...album, type: "albums" }));
};

export const mapPlaylistToContent = (
  playlists: PlaylistContentRepository[],
): PlaylistContentService[] => {
  return playlists.map(({ tracks, ...newPlaylist }) => ({
    ...newPlaylist,
    type: "playlists",
    tracks: tracks?.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      cover: item.track.cover,
    })),
  }));
};

export const mapTrackToContent = ({
  _count,
  ...track
}: TrackContentRepository): TrackContentService => {
  return {
    ...track,
    type: "tracks",
    likes: _count.likes || 0,
  };
};
