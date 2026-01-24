import { ImageSizes } from "./common.types";

export interface PlaylistTrackReference {
  track: {
    id: string;
    cover: ImageSizes;
  };
}
export interface UserPlaylistRepository {
  playlists: {
    id: string;
    name: string;
    cover: ImageSizes;
    tracks: {
      track: {
        id: string;
        cover: ImageSizes;
      };
    }[];
  }[];
}
