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

export interface BaseMediaCard {
  id: string;
  title: string;
  href: string;
  image?: ImageSizes;
  images?: ImageSizes[] | null;
}

export type MediaCard = TrackCard | AlbumCard | ArtistCard | PlaylistCard;

export interface TrackCard extends BaseMediaCard {
  type: "track";
  artists: { id: string; name: string; avatar: ImageSizes }[];
  duration: number;
  lyrics: string | null;
  reproductions: number;
  likes: number;
  playData?: {
    trackId: string;
  };
}

export interface AlbumCard extends BaseMediaCard {
  type: "album";
  artists: { id: string; name: string; avatar: ImageSizes }[];
  releaseDate?: string;
  playData?: {
    contextId: string;
    contextType: "album";
  };
}

export interface ArtistCard extends BaseMediaCard {
  type: "artist";
  verified: boolean;
}

export interface PlaylistCard extends BaseMediaCard {
  type: "playlist";
  /* trackCount: number; */
  playData?: {
    contextId: string;
    contextType: "playlist";
  };
}

export interface CollectionTrack {
  type: "track";
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
  type: "album";
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
  type: "playlist";
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
