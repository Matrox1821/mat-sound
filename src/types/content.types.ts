import { ArtistBase } from "./artist.types";
import { ImageSizes } from "./common.types";

export interface ArtistContentService {
  type: "artists";
  name: string;
  id: string;
  avatar: ImageSizes | null;
}

export interface AlbumContentService {
  id: string;
  name: string;
  cover: ImageSizes | null;
  type: "albums";
  artists: ArtistBase[];
}

export interface TrackContentService {
  type: "tracks";
  id: string;
  name: string;
  cover: ImageSizes | null;
  song: string;
  releaseDate: Date;
  duration: number;
  lyrics: string | null;
  reproductions: number;
  likes: number;
  artists: ArtistBase[];
  albums: TrackAlbumRelation[];
}

export interface ContentTrack extends Omit<TrackContentService, "recommendedTracks"> {
  recommendedTracks: TrackContentService[];
}

export type ContentElement =
  | ContentTrack
  | AlbumContentService
  | ArtistContentService
  | PlaylistContentService;

//Repo

export interface AlbumBase {
  id: string;
  name: string;
  cover: ImageSizes;
}

export interface AlbumContentRepository extends AlbumBase {
  artists: ArtistBase[];
}

export interface TrackAlbumRelation {
  album: AlbumBase;
  order: number;
  disk: number;
}

export interface TrackContentRepository {
  id: string;
  name: string;
  cover: ImageSizes;
  song: string;
  releaseDate: Date;
  duration: number;
  lyrics: string | null;
  reproductions: number;
  artists: ArtistBase[];
  albums: TrackAlbumRelation[];
  _count: {
    likes: number;
  };
}

export interface PlaylistContentService {
  id: string;
  name: string;
  cover?: ImageSizes;
  tracks?: { id: string; name: string; cover: ImageSizes }[];
  type: "playlists";
}

export interface PlaylistContentRepository {
  id: string;
  name: string;
  cover?: ImageSizes;
  tracks?: { track: { id: string; name: string; cover: ImageSizes } }[];
}
