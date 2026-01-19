import { ImageSizes } from "./common.types";
import { ArtistBase } from "./artist.types";

export interface AlbumBase {
  id: string;
  name: string;
  cover: ImageSizes;
}

export interface AlbumWithArtists extends AlbumBase {
  artists: ArtistBase[];
}

export interface AlbumTrack {
  order: number;
  disk: number;
  track: {
    id: string;
    name: string;
    cover: ImageSizes;
    song: string;
    duration: number;
    lyrics: string | null;
    reproductions: number;
    artists: ArtistBase[];
    albums: AlbumBase[];
  };
}

export interface AlbumById extends AlbumBase {
  trackCount: number;
  releaseDate: Date;
  duration: number;
  artists: ArtistBase[];
  tracks: AlbumTrack[];
}

export interface AlbumByPagination {
  name: string;
  id: string;
  cover?: ImageSizes;
  releaseDate?: Date;
  artists?: {
    name: string;
    id: string;
    avatar: ImageSizes;
  }[];
  tracks?: {
    track: {
      name: string;
      id: string;
      cover: ImageSizes;
    };
    order: number;
    disk: number;
  }[];
}
