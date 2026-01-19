import { ContentType } from "./common.types";
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
          artists?: { name: string; id: string }[] | null;
          reproductions: number;
          duration: number;
          song: string;
          lyrics: string;
        };
      }[]
    | null;
  artists?: { name: string; id: string; avatar: ImageSizes }[] | null;
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
  lyrics: string;
  isLiked: boolean;
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
        name: string;
        id: string;
        avatar: ImageSizes;
      }[]
    | null;
  artist?: { name: string; id: string; avatar: ImageSizes } | null;
  tracks?: {
    albums: {
      album: {
        id: string;
        name: string;
      };
    }[];
    artists: {
      id: string;
      name: string;
      avatar: ImageSizes;
    }[];
    lyrics: string;
    duration: number;
    id: string;
    name: string;
    cover: ImageSizes;
    song: string;
    release_date: string;
    reproductions: number;
    isLiked: boolean;
    _count?: {
      likes: number;
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
  lyrics: string;
  _count: {
    likes: number;
  };
  albums: { album: { name: string; id: string; cover: ImageSizes } }[];
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
