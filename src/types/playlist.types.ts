import { ImageSizes } from "./common.types";

export interface PlaylistTrackReference {
  track: {
    id: string;
    cover: ImageSizes;
  };
}

export interface PlaylistRepo {
  id: string;
  name: string;
  cover?: ImageSizes;
  images?: string[];
  isInPlaylist: boolean;
  tracks: PlaylistTrackReference[];
}

export interface UserPlaylistsRepo {
  playlists: PlaylistRepo[];
}
export interface TrackPlaylistStatus {
  id: string;
  name: string;
  cover?: ImageSizes;
  isInPlaylist: boolean; // Indica si el track actual pertenece a esta lista
}
export interface PlaylistSelectionItem {
  id: string;
  name: string;
  cover?: ImageSizes;
  images?: string[];
  isInPlaylist: boolean;
  tracks: PlaylistRepo[];
}
