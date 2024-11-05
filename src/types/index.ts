export interface RgbProps {
  r: number;
  g: number;
  b: number;
}

export type Socials = { [key: string]: string };
//Tracks endpoints /tracks/*

/**
 * Tracks endpoints
  @example 
  /api/tracks/[id]
  /api/tracks
 */
export interface trackProps {
  id: string;
  image: string;
  name: string;
  order_in_album: number | null;
  song_url: string;
  release_date: string;
  copyright: string[];
  reproductions: number;
  seconds: number;
  album?: {
    name: string;
    id: string;
    image: string;
  } | null;
  artist?: {
    name: string;
    id: string;
    avatar: string;
  } | null;
}

//Albums endpoints

/**
 * Albums endpoints
 @example 
 /api/albums
 */
export interface albumProps {
  id?: string;
  image?: string;
  name?: string;
  copyright?: string[];
  release_date?: string;
  artist?: {
    id?: string;
    name?: string;
    avatar?: string;
  } | null;
  tracks?: {
    id?: string;
    name?: string;
    image?: string;
    song_url?: string;
    order_in_album?: number | null;
  }[];
}

//Artist endpoints /artist/*

/**
 * Artist endpoints
 @example 
/api/artists
 */

export interface artistProps {
  id: string;
  name: string;
  avatar?: string;
}

/**
 * Artist endpoints
 @example 
/api/artists/[id]
 */
export interface artistByIdProps {
  id: string;
  name: string;
  description: string | null;
  listeners: number;
  social: { [key: string]: string } | null;
  is_verified: boolean;
  avatar: string;
  covers: string[] | null;
}

/**
 * Artist endpoints
 @example 
 /api/artists/[id]/tracks
 */
export interface trackByArtistIdProps {
  id: string;
  image: string;
  name: string;
  order_in_album: number | null;
  song_url: string;
  album: {
    name: string;
    id: string;
  } | null;
}

/**
 * From artist endpoints.
 @example 
 /api/artists/[id]/albums
 */
export interface albumByArtistIdProps {
  id: string;
  image: string;
  name: string;
  copyright?: string[];
  release_date?: string;
}
