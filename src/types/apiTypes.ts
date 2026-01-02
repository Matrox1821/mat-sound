import { ContentType } from ".";
import { HttpStatusCode } from "./httpStatusCode";

export interface APIAlbum {
  id: string;
  cover: ImageSizes;
  name: string;
  release_date: string;
  copyright: string[];
  duration: number;
  _count: {
    tracks: number;
  };
  tracks?:
    | {
        order: number;
        disk: number;
        track: {
          name: string;
          id: string;
          cover: ImageSizes;
          artists?: { artist: { name: string; id: string } }[] | null;
          reproductions: number;
          duration: number;
          song: string;
          lyric: string;
        };
      }[]
    | null;
  artists?: { artist: { name: string; id: string; avatar: ImageSizes } }[] | null;
}

export interface ImageSizes {
  sm: string;
  md: string;
  lg: string;
}

export interface APIContent {
  id: string;
  avatar?: ImageSizes;
  cover?: ImageSizes;
  name: string;
  song?: string;
  type: ContentType;
  duration: number;
  reproductions: number;
  release_date: string;
  lyric: string;
  _count?: {
    likes: number;
  };
  albums?:
    | {
        album: {
          name: string;
          id: string;
          cover: ImageSizes;
        };
      }[]
    | null;
  artists?:
    | {
        artist: {
          name: string;
          id: string;
          avatar: ImageSizes;
        };
      }[]
    | null;
  artist?: { name: string; id: string; avatar: ImageSizes } | null;
  tracks?: {
    track: {
      albums: {
        album: {
          id: string;
          name: string;
        };
      }[];
      artists: {
        artist: {
          id: string;
          name: string;
          avatar: ImageSizes;
        };
      }[];
      lyric: string;
      duration: number;
      id: string;
      name: string;
      cover: ImageSizes;
      song: string;
      release_date: string;
      reproductions: number;
      _count: {
        likes: number;
      };
    };
  }[];
}

export interface APIArtist {
  id: string;
  name: string;
  avatar: ImageSizes;
  main_cover?: string;
  description?: string;
  listeners: number;
  is_verified: boolean;
  regional_listeners?: { [key: string]: string }[];
  socials?: { [key: string]: string }[];
  covers?: string[];
  followers_default: number;
  _count: {
    followers: number;
  };
}

export interface APIArtistTrack {
  id: string;
  name: string;
  cover: ImageSizes;
  song: string;
  release_date: string;
  duration: number;
  reproductions: number;
  lyric: string;
  _count: {
    likes: number;
  };
  albums: { album: { name: string; id: string; cover: ImageSizes } }[];
}

// FORMDATA-------------------------

export interface ArtistFormData {
  name: string;
  avatar: File | null;
  main_cover: File | null;
  listeners: number;
  followers: number;
  description: string;
  is_verified: boolean;
  regional_listeners: Record<string, string>;
  socials: Record<string, string>;
  covers: File[] | null;
}
export interface AlbumFormData {
  name: string;
  cover: File | null;
  release_date: string;
  artists: string[];
  tracks: string[];
  tracks_order: { [key: string]: string };
}
export interface TrackFormData {
  name: string;
  cover: File | null;
  song: File | null;
  release_date: string;
  duration: number;
  reproductions: number;
  genres: string[];
  order_and_disk: {
    [key: string]: { order: number; disk: number };
  };
  artists: string[];
  lyric: string;
}
export interface GenreFormData {
  genre: string | string[];
}

// ERROR ----------------------

export class CustomError extends Error {
  private httpStatusCode: HttpStatusCode;
  private errors: any[];

  constructor({
    msg,
    httpStatusCode,
    errors = [],
  }: {
    msg: string;
    httpStatusCode: HttpStatusCode;
    errors?: any[];
  }) {
    super(msg);
    this.errors = errors;
    this.httpStatusCode = httpStatusCode;
  }

  public get errorData() {
    return {
      message: this.message,
      httpStatusCode: this.httpStatusCode,
      errors: this.errors,
    };
  }
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  errors?: any[];
}
