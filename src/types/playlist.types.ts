import { ImageSizes } from "./common.types";

export interface PlaylistTrackReference {
  track: {
    id: string;
    cover: ImageSizes;
  };
}

export interface PlaylistSelectionItem {
  id: string;
  name: string;
  cover?: ImageSizes;
  images?: string[];
  isInPlaylist: boolean;
  tracks: PlaylistTrackReference[];
}

export interface UserPlaylistsResponse {
  playlists: PlaylistSelectionItem[];
}
export interface TrackPlaylistStatus {
  id: string;
  name: string;
  cover?: ImageSizes;
  isInPlaylist: boolean; // Indica si el track actual pertenece a esta lista
}
