//store interface

//enums
export enum Size {
  Mobile = "mobile",
  Desktop = "desktop",
}

export enum AMOUNTS {
  thousand = 1000,
  million = 1000000,
  billion = 1000000000,
  trillion = 1000000000000,
}

//types
export type ContentType = "albums" | "tracks" | "artists" | "playlists" | "none";

export type LoopMode = "none" | "all" | "one";

export interface ImageSizes {
  sm: string;
  md: string;
  lg: string;
}

//return types
export interface RgbProps {
  r: number;
  g: number;
  b: number;
}

export interface contentProps {
  id: string;
  image: ImageSizes;
  name: string;
  song: string;
  type: ContentType;
  duration: number;
  reproductions: number;
  releaseDate: string;
  isLiked: boolean;
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
  tracks?:
    | {
        albums?:
          | {
              id: string;
              name: string;
            }[]
          | null;
        artists?:
          | {
              id: string;
              name: string;
              avatar: ImageSizes;
            }[]
          | null;
        duration: number;
        id: string;
        name: string;
        cover: ImageSizes;
        song?: string;
        releaseDate: string;
        reproductions: number | null;
        likes: number | null;
        lyrics: string;
        isLiked: boolean;
      }[]
    | null;
  artist?: { name: string; id: string; avatar: ImageSizes } | null;
}
export interface trackAlbumsProps {
  order_in_album?: number | null;
  album: {
    name: string;
    id: string;
    cover: ImageSizes;
  };
}
export interface trackArtistsProps {
  artist: {
    name: string;
    id: string;
    avatar: ImageSizes;
  };
}
//track page props
export interface trackPageProps {
  id: string;
  name: string;
  cover: ImageSizes;
  releaseDate: string;
  copyright: string[];
  duration: number;
  song: string;
  likes: number;
  reproductions: number;
  lyrics: string;
  artists: { name: string; id: string; avatar: ImageSizes }[] | null;
  albums: { id: string; cover: ImageSizes; name: string }[] | null;
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
//album page props
export interface albumPageProps {
  id: string;
  cover: ImageSizes;
  name: string;
  releaseDate: string;
  copyright: string[];
  duration: number;
  tracksCount: number;

  tracks?: {
    order: number;
    disk: number;
    name: string;
    id: string;
    cover: ImageSizes;
    artists?: { name: string; id: string }[] | null;
    albums?: { albums: { name: string; id: string } }[] | null;
    reproductions: number;
    duration: number;
    song: string;
    lyrics: string;
  }[];
  artists?: { name: string; id: string; avatar: ImageSizes }[] | null;
}

//artist page props
export interface artistPageProps {
  id: string;
  name: string;
  avatar: ImageSizes;
  mainCover?: string;
  description?: string;
  listeners: number;
  isVerified: boolean;
  regionalListeners?: { [key: string]: string }[];
  socials?: { [key: string]: string }[];
  covers?: string[];
  followers: number;
}

export interface artistTracksProps {
  id: string;
  name: string;
  cover: ImageSizes;
  song: string;
  releaseDate: string;
  duration: number;
  reproductions: number;
  likes: number;
  lyrics: string;
  albums: { album: { name: string; id: string; cover: ImageSizes } }[] | null;
}

export interface TracksByArtistIdQuery {
  sortBy?: "id" | "name" | "release_date" | "reproductions" | "duration" | "created_at";
  order?: "asc" | "desc";
  limit?: number;
}
