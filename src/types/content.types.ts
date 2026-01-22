import { ArtistBase } from "./artist.types";
import { ImageSizes } from "./common.types";

export interface MappedArtistService {
  type: "artists";
  name: string;
  id: string;
  avatar: ImageSizes | null;
}

export interface MappedAlbumService {
  id: string;
  name: string;
  cover: ImageSizes | null;
  type: "albums";
  artists: ArtistBase[];
}

export interface MappedTrackService {
  type: "tracks";
  id: string;
  name: string;
  cover: ImageSizes | null;
  song: string;
  releaseDate: Date;
  duration: number;
  lyrics: string | null;
  reproductions: number;

  artists: ArtistBase[];
  albums: TrackAlbumRelation[];
  playlists: TrackPlaylistRelation[];
  isLiked: boolean;
  collections: TrackCollectionRelation[];

  likes: number;
  userPlaylists: UserPlaylistMappedTrackService[] | undefined | null;
}

export interface UserPlaylistMappedTrackService {
  id: string;
  name: string;
  image?: ImageSizes;
  isInPlaylist: boolean;
  type: "playlists";
}

export interface PLaylistRepo {
  type: string;
  id: string;
  name: string;
  cover: ImageSizes;
}

export interface DiscoveryTrack extends Omit<MappedTrackService, "recommendedTracks"> {
  recommendedTracks: MappedTrackService[];
}

export type ContentElement =
  | DiscoveryTrack
  | MappedAlbumService
  | MappedArtistService
  | PlaylistService;

//Repo

export interface AlbumBase {
  id: string;
  name: string;
  cover: ImageSizes;
}

export interface AlbumWithArtistsRepo extends AlbumBase {
  artists: ArtistBase[];
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

export interface TrackWithRelationsRepo {
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
  playlists: TrackPlaylistRelation[];
  likes?: TrackLike[];
  collections: TrackCollectionRelation[];

  _count: {
    likes: number;
  };
}
export interface PlaylistRepo {
  id: string;
  name: string;
  cover?: ImageSizes;
  tracks?: {
    track: {
      id: string;
      cover: ImageSizes;
    };
  }[];
}
export interface UserPlaylistsRepo {
  playlists: PlaylistRepo[];
}

export interface PlaylistService {
  id: string;
  name: string;
  image?: ImageSizes;
  tracks?: ImageSizes[];
  type: "playlists";
}
