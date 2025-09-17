//store interface

export interface PlayerState {
  isPlaying: boolean;
  currentMusic: storeTrackProps | null;
  isActive: boolean;
  playerScreenIsOpen: boolean;
  inLoop: boolean;
  isShuffled: boolean;
  currentTime: number;
  duration: number;
  actions?: {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    setTrack: (track: storeTrackProps) => void;
    setPlaylist: (playlist: storeTrackProps[]) => void;
    setRecommendedSongs: (songs: storeTrackProps[]) => void;
    setLoopMode: (mode: LoopMode) => void;
    openPlayerScreen: () => void;
    closePlayerScreen: () => void;
    activatePlayer: () => void;
    deactivatePlayer: () => void;
  };
}

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
export type ContentType = "albums" | "tracks" | "artists" | "playlists" | "albums-by-artist";

export type LoopMode = "none" | "all" | "one";

//return types
export interface RgbProps {
  r: number;
  g: number;
  b: number;
}

export interface contentProps {
  id: string;
  image: string | string[];
  name: string;
  song: string;
  type: ContentType;
  seconds: number;
  duration: number;
  reproductions: number;
  release_date: string;
  likes: number;
  albums?:
    | {
        order_in_album?: number | null;
        album: {
          name: string;
          id: string;
          image: string;
        };
      }[]
    | null;
  artists?:
    | {
        artist: {
          name: string;
          id: string;
          avatar: string;
        };
      }[]
    | null;
  artist?: { name: string; id: string; avatar: string } | null;
}
export interface trackAlbumsProps {
  order_in_album?: number | null;
  album: {
    name: string;
    id: string;
    image: string;
  };
}
export interface trackArtistsProps {
  artist: {
    name: string;
    id: string;
    avatar: string;
  };
}
export interface storeTrackProps {
  id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
  duration: number;
}
//track page props
export interface trackPageProps {
  id: string;
  name: string;
  image: string;
  releaseDate: string;
  copyright: string[];
  artists: { artist: { name: string; id: string; image: string } }[] | null;
  duration: number;
  song: string;
  likes: number;
  reproductions: number;
  albums: { album: { id: true; image: true; name: true } }[] | null;
}
//album page props
export interface albumPageProps {
  id: string;
  image: string;
  name: string;
  releaseDate: string;
  copyright: string[];
  duration: number;
  tracksCount: number;
  tracks?:
    | {
        orderInAlbum: number;
        track: {
          name: string;
          id: string;
          image: string;
          artists?: { artist: { name: string; id: string } }[] | null;
          reproductions: number;
          duration: number;
          song: string;
        };
      }[]
    | null;
  artist?: { name: string; id: string; image: string } | null;
}

//artist page props
export interface artistPageProps {
  id: string;
  name: string;
  image: string;
  pageCover?: string;
  description?: string;
  listeners: number;
  isVerified: boolean;
  regionalListeners?: { [key: string]: string }[];
  socials?: { [key: string]: string }[];
  covers?: string[];
  followers: number;
}

export interface artistRecentsTracksProps {
  id: string;
  name: string;
  image: string;
  song: string;
  releaseDate: string;
  duration: number;
  reproductions: number;
  likes: number;
  albums: { album: { name: string; id: string; image: string } }[] | null;
}

export interface TracksByArtistIdQuery {
  sortBy?: "id" | "name" | "release_date" | "reproductions" | "duration" | "created_at";
  order?: "asc" | "desc";
  limit?: number;
}
