import { ImageSizes } from "./apiTypes";

export interface APITrack {
  id: string;
  name: string;
  cover: ImageSizes;
  release_date: string;
  copyright: string[];
  artists: { name: string; id: string; avatar: ImageSizes }[] | null;
  duration: number;
  song: string;
  likes: number;
  reproductions: number;
  lyrics: string;
  albums: { album: { id: string; cover: ImageSizes; name: string } }[] | null;
  playlists:
    | {
        id: string;
        cover?: ImageSizes;
        images?: ImageSizes;
        name: string;
        isInPlaylist: boolean;
        tracks: { track: { id: string; cover: ImageSizes } }[];
      }[]
    | null;
}

export interface TrackGenreProps {
  id: string;
  name: string;
}
export interface TrackArtistRelationProps {
  id: string;
  name: string;
  avatar: any;
}
export interface TrackAlbumRelationProps {
  id: string;
  name: string;
  cover: any;
}
export interface TrackPlaylistRelationProps {
  id: string;
  name: string;
}

//tracks
export interface DBTrack {
  id: string;
  name: string;
  cover: ImageSizes;
  song: string;
  releaseDate: string;
  duration: number;
  reproductions: number;
  lyrics: string;
  genres?: TrackGenreProps[];
  artists?: TrackArtistRelationProps[];
  albums?: TrackAlbumRelationProps[];
  playlists?: TrackPlaylistRelationProps[];
  likes?: number;
}

//Player Track Props
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
  isLiked: boolean;
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
  playlists?:
    | {
        id: string;
        cover?: ImageSizes;
        images?: ImageSizes;
        name: string;
        isInPlaylist: boolean;
        tracks: { track: { id: string; cover: ImageSizes } }[];
      }[]
    | null;
}
