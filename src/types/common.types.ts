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

export interface TracksByArtistIdQuery {
  sortBy?: "id" | "name" | "releaseDate" | "reproductions" | "duration" | "createdAt";
  order?: "asc" | "desc";
  limit?: number;
}
