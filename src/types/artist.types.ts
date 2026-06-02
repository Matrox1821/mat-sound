import { ImageSizes } from "./common.types";

export interface ArtistSearchParams {
  artistNameFilter?: string;
  page?: string;
  rows?: string;
  "no-avatar"?: string;
  "no-main-cover"?: string;
  "no-description"?: string;
  "no-is-verified"?: string;
  "no-regional-listeners"?: string;
  "no-socials"?: string;
  "no-covers"?: string;
  "no-albums"?: string;
  "no-tracks"?: string;
}

export interface ParsedArtistSearchParams {
  artistName?: string;
  page: number;
  rows: number;
  noAvatar: boolean;
  noMainCover: boolean;
  noDescription: boolean;
  noIsVerified: boolean;
  noRegionalListeners: boolean;
  noSocials: boolean;
  noCovers: boolean;
  noAlbums: boolean;
  noTracks: boolean;
}

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
}
export interface ArtistServer {
  followers: number;
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
