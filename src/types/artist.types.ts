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
  name: string;
  id: string;
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
  likes?: {
    userId: string;
    trackId: string;
    likedAt: Date;
  }[];
  cover: ImageSizes;
  song: string | null;
  releaseDate: Date;
  duration: number;
  lyrics: string | null;
  reproductions: number;
}

export interface ArtistTracks {
  isLiked: boolean;
  likes: number;
  albums: {
    name: string;
    id: string;
    cover: ImageSizes;
  }[];
  name: string;
  id: string;
  cover: ImageSizes;
  song: string | null;
  releaseDate: Date;
  duration: number;
  lyrics: string | null;
  reproductions: number;
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
