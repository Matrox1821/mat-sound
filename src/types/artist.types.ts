import { ImageSizes } from "./common.types";

export interface ArtistBase {
  id: string;
  name: string;
  avatar: ImageSizes | null;
}
export interface ArtistByPagination {
  listeners?: number;
  id: string;
  name: string;
  avatar?: ImageSizes | null;
  mainCover?: string | null;
  description?: string | null;
  isVerified?: boolean;
  regionalListeners?: { [key: string]: string }[] | null;
  socials?: { [key: string]: string }[] | null;
  covers?: string[];
  followersDefault?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ArtistTracksRepository {
  id: string;
  name: string;
  cover: ImageSizes;
  releaseDate: Date;
  duration: number;
  song: string | null;
  reproductions: number;
  lyrics: string | null;
  playlists: {
    addedAt: Date;
    trackId: string;
    playlistId: string;
    tracks: { id: string; cover: string; name: string }[];
  }[];
  albums: {
    album: {
      name: string;
      id: string;
      cover: ImageSizes;
    };
  }[];
  _count: {
    likes: number;
  };
  genres: {
    id: string;
    name: string;
  }[];
  likes?: {
    userId: string;
    trackId: string;
    likedAt: Date;
  }[];
}

export interface ArtistTracks {
  id: string;
  name: string;
  cover: ImageSizes;
  releaseDate: Date;
  duration: number;
  song: string | null;
  reproductions: number;
  lyrics: string | null;
  likes: number;
  artists?: ArtistBase[];
  albums: {
    name: string;
    id: string;
    cover: ImageSizes;
  }[];
  genres: {
    id: string;
    name: string;
  }[];
}

export interface ArtistRepository {
  _count: {
    followers: number;
  };
  name: string;
  id: string;
  listeners: number;
  avatar: ImageSizes;
  mainCover: string | null;
  description: string | null;
  isVerified: boolean;
  regionalListeners: ImageSizes;
  socials: ImageSizes;
  covers: string[];
  followersDefault: number;
  followers: {
    userId: string;
    artistId: string;
    followedAt: Date;
  }[];
}
export interface ArtistServer {
  followers: number;
  isFollowing: boolean;
  name: string;
  id: string;
  listeners: number;
  avatar: ImageSizes;
  mainCover: string | null;
  description: string | null;
  isVerified: boolean;
  regionalListeners: ImageSizes;
  socials: ImageSizes;
  covers: string[];
}
