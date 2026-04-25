import { ImageSizes } from "./common.types";

export interface UserFavoritesRepository {
  likes: {
    userId: string;
    trackId: string;
    likedAt: Date;
    track: {
      id: string;
      name: string;
      _count: {
        likes: number;
      };
      cover: ImageSizes;
      song: string | null;
      duration: number;
      lyrics: string | null;
      reproductions: number;
      artists: {
        id: string;
        name: string;
        avatar: ImageSizes;
      }[];
    };
  }[];
}

export interface UserData {
  id: string;
  biography: string | null;
  username: string;
  displayUsername: string;
  avatar: string | null;
  location: string | null;
  following: number;
  followedBy: number;
  updatedAt: Date;
}

export interface CollectionTrack {
  type: "tracks";
  id: string;
  name: string;
  cover: ImageSizes;
  artists: {
    id: string;
    name: string;
    avatar: ImageSizes;
  }[];
  addedAt: Date;
}
export interface CollectionAlbum {
  type: "albums";
  id: string;
  name: string;
  cover: ImageSizes;
  tracksCount: number;
  artists: {
    id: string;
    name: string;
    avatar: ImageSizes;
  }[];
  addedAt: Date;
}
export interface CollectionPlaylist {
  type: "playlists";
  id: string;
  name: string;
  cover?: ImageSizes;
  tracksCount: number;
  _count: {
    tracks: number;
  };
  tracksCover: ImageSizes[];

  addedAt: Date;
}

export type UserCollection = CollectionTrack | CollectionAlbum | CollectionPlaylist;

export interface CollectionRepository {
  id: string;
  name: never;
  playlists: {
    playlist: {
      id: string;
      name: string;
      cover: ImageSizes;
      tracks: {
        track: {
          id: string;
          name: string;
          cover: ImageSizes;
          artists: {
            id: string;
            name: string;
          }[];
        };
      }[];
      addedAt: never;
    };
  }[];
  cover: never;
  tracks: {
    track: {
      id: string;
      name: string;
      cover: ImageSizes;
      artists: {
        id: string;
        name: string;
      }[];
    };
    addedAt: Date;
  }[];
  albums: {
    album: {
      id: string;
      name: string;
      cover: ImageSizes;
      artists: {
        id: string;
        name: string;
      }[];
    };
    addedAt: Date;
  }[];
}

export interface TrackDetails {
  id: string;
  name: string;
  cover: ImageSizes;
  artists: ArtistDetails[];
}

export interface PlaylistDetails {
  id: string;
  name: string;
  cover: ImageSizes | null; // El cover propio de la playlist
  tracks: TrackDetails[];
}

export interface ArtistDetails {
  id: string;
  name: string;
}

export interface AlbumDetails {
  id: string;
  name: string;
  cover: ImageSizes;
  artists: ArtistDetails[];
}

export interface CollectionService {
  tracks: Map<string, TrackDetails>;
  albums: Map<string, AlbumDetails>;
  playlists: Map<string, PlaylistDetails>;
}
