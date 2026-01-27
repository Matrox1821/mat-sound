// FORMDATA-------------------------

export interface ArtistFormData {
  id?: string;
  name: string;
  avatar: File | null;
  mainCover: File | null;
  listeners: number;
  followers: number;
  description: string;
  isVerified: boolean;
  regionalListeners: Record<string, string>;
  socials: Record<string, string>;
  covers: File[] | null;
}

export interface AlbumFormData {
  id?: string;
  name: string;
  cover: File | null;
  releaseDate: string;
  artists?: string[];
  tracks?: string[];
  tracksOrder?: { [key: string]: { order: number; disk: number } };
}

export interface TrackFormData {
  id?: string;
  name: string;
  cover: File | null;
  song: File | null;
  releaseDate: string;
  duration: number;
  reproductions: number;
  genres: string[];
  orderAndDisk: {
    [key: string]: { order: number; disk: number };
  };
  artists: string[];
  lyrics: string;
}

export interface GenreFormData {
  genre: string | string[];
}

export interface UserFormData {
  id: string;
  avatar: File | null;
  displayUsername: string;
  biography: string;
  location: string;
}
