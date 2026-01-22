import { ImageSizes } from "./common.types";
import { ArtistBase } from "./artist.types";
import { AlbumBase } from "./album.types";
import { PlaylistSelectionItem, TrackPlaylistStatus } from "./playlist.types";

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
  artists: ArtistBase[];
  albums: {
    album: AlbumBase;
  }[];
  genres: TrackGenre[];
  _count: {
    likes: number;
  };
  likes?: {
    userId: string;
  }[];
}

export interface TrackAlbumRelation {
  album: AlbumBase;
  order: number;
  disk: number;
}

export interface TrackLike {
  userId: string;
  trackId: string;
  likedAt: Date;
}

export interface TrackPlaylistRelation {
  trackId: string;
  playlistId: string;
  addedAt: Date;
}

export interface TrackCollectionRelation {
  trackId: string;
  addedAt: Date;
  collectionId: string;
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
  playlists: TrackPlaylistRelation[];
  likes: TrackLike[];
  collections: TrackCollectionRelation[];

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
  isLiked: boolean; // Antes likes: []
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
  isLiked: boolean;
  userPlaylists?: TrackPlaylistStatus[];
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

export interface TrackByIdApiResponse extends TrackWithRecommendations {
  playlists: PlaylistSelectionItem[];
}
