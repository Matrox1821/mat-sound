export interface TrackObject {
  song: string;
  image?: ImageMetadata;
  name: string;
  artist: string;
  album?: string;
}
export interface TrackProps {
  song: string;
  image: ImageMetadata;
  name: string;
  artist: string;
  album?: AlbumObject;
  id: string;
}

/* export interface AlbumPropsEndpoint {
  id: string;
  name: string;
  image: string;
  artist: string;
}

export interface ArtistPropsEndpoint {
  id: string;
  name: string;
  image: string;
  artist_id: string;
} */

export interface TrackPropsEndpoint {
  album: {
    id: string;
    name: string;
  } | null;
  artist: {
    id: string;
    name: string;
  } | null;
  created_at: string;
  id: string;
  image: string | null;
  name: string;
  order_in_album: number | null;
  song_url: string;
  updated_at: string;
}
export interface ArtistTracks {
  image: string | null;
  artist: string | null;
  album: string | null;
  created_at: string;
  id: string;
  name: string;
  order_in_album: number | null;
  song_url: string;
  updated_at: string;
}

export interface ArtistPropsEndpoint {
  created_at: string;
  id: string;
  image: string;
  name: string;
  updated_at: string;
}

export interface ArtistPropsData {
  created_at: string;
  id: string;
  image: string;
  name: string;
  updated_at: string;
  album: number;
  tracks: number;
}
export interface Album {
  artist: string | null;
  created_at: string;
  id: string;
  image: string;
  name: string;
  updated_at: string;
}

export interface AlbumObject {
  id: string;
  name: string;
  image: ImageMetadata;
  tracks: string[];
  artist: string;
}
export interface AlbumProps {
  id: string;
  name: string;
  image: ImageMetadata;
  tracks: TrackProps[];
  artist: string;
}

export interface ArtistObject {
  id: string;
  name: string;
  image: ImageMetadata;
  albums: string[];
}
export interface ArtistProps {
  id: string;
  name: string;
  image: ImageMetadata;
  albums: (AlbumProps | undefined)[];
}
export interface RgbProps {
  r: number;
  g: number;
  b: number;
}
