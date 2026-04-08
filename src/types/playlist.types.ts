import { ImageSizes } from "./common.types";

export interface PlaylistTrackReference {
  track: {
    id: string;
    cover: ImageSizes;
  };
}
export interface UserPlaylistRepository {
  playlists: {
    id: string;
    name: string;
    cover: ImageSizes | null;
    tracks: {
      track: {
        id: string;
        cover: ImageSizes;
      };
    }[];
  }[];
}
export interface PlaylistRepository {
  user: {
    id: string;
    avatar: string | null;
    displayUsername: string;
    username: string;
  };
  id: string;
  name: string;
  cover: ImageSizes | null;
  createdAt: Date;
  updatedAt: Date;
  tracks: {
    track: {
      id: string;
      name: string;
      cover: ImageSizes;
      song: string | null;
      duration: number;
      reproductions: number;
      artists: {
        id: string;
        name: string;
        avatar: ImageSizes;
      }[];
    };
    addedAt: Date;
  }[];
  _count: {
    tracks: number;
  };
}

export interface PlaylistService {
  tracksCount: number;
  tracks: {
    id: string;
    name: string;
    cover: ImageSizes;
    song: string | null;
    duration: number;
    reproductions: number;
    artists: {
      id: string;
      name: string;
      avatar: ImageSizes;
    }[];
  }[];
  coverListDefault: ImageSizes[];
  canEdit: boolean;
  user: {
    id: string;
    avatar: string | null;
    displayUsername: string;
    username: string;
  };
  id: string;
  name: string;
  cover: ImageSizes | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaylistFormData {
  id: string;
  cover: File | null;
  name: string;
}
