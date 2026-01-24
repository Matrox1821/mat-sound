import { ImageSizes } from "./common.types";

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
