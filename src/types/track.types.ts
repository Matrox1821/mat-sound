import { ImageSizes } from "./common.types";
import { ArtistBase } from "./artist.types";
import { AlbumBase } from "./album.types";

export interface TrackGenre {
  id: string;
  name: string;
}

export interface TrackById {
  id: string;
  name: string;
  cover: ImageSizes;
  releaseDate: Date;
  duration: number;
  song: string;
  reproductions: number;
  lyrics: string | null;
  albums: {
    album: AlbumBase;
  }[];
  genres: TrackGenre[];
  _count: {
    likes: number;
  };

  artists: ArtistBase[];
}

export interface TrackAlbumRelation {
  album: AlbumBase;
  order: number;
  disk: number;
}

export interface TrackWithRelations {
  id: string;
  name: string;
  cover: ImageSizes; // Mapeamos JsonValue a ImageSizes
  song: string;
  releaseDate: Date;
  duration: number;
  lyrics: string | null;
  reproductions: number;

  // Relaciones
  artists: ArtistBase[];
  albums: TrackAlbumRelation[];

  // Metadatos de Prisma
  _count: {
    likes: number;
  };
}
export interface TrackByIdMapped {
  id: string;
  name: string;
  cover: ImageSizes;
  song: string;
  duration: number;
  reproductions: number;
  releaseDate: Date;
  lyrics: string | null;
  artists: ArtistBase[];
  albums: {
    id: string;
    name: string;
    order: number;
    disk: number;
  }[];
  likes: number; // Antes _count.likes
  type: "track";
}
export interface TrackMapped {
  id: string;
  name: string;
  cover: ImageSizes;
  song: string;
  duration: number;
  reproductions: number;
  releaseDate: Date;
  lyrics: string | null;
  artists: ArtistBase[];
  albums: {
    id: string;
    name: string;
    order: number;
    disk: number;
  }[];
  likes: number;
}

export interface TrackWithRecommendations extends TrackMapped {
  recommendedTracks: TrackMapped[];
}

export interface TrackByPagination {
  name: string;
  id: string;
  cover?: ImageSizes;
  song?: string | null;
  releaseDate?: Date;
  duration?: number;
  lyrics?: string | null;
  reproductions?: number;
  genres?: {
    name: string;
    id: string;
    addedAt: Date;
  }[];
  artists?: {
    name: string;
    id: string;
    avatar: ImageSizes;
  }[];
  albums?: {
    order: number;
    disk: number;
    album: {
      name: string;
      id: string;
      cover: ImageSizes;
    };
  }[];
}

export interface playerTrackProps {
  id: string;
  cover: ImageSizes;
  name: string;
  song: string;
  duration: number;
  reproductions: number;
  releaseDate: string;
  likes: number;
  lyrics: string;
  albums?:
    | {
        name: string;
        id: string;
        cover: ImageSizes;
      }[]
    | null;
  artists?:
    | {
        name: string;
        id: string;
        avatar: ImageSizes;
      }[]
    | null;
}
