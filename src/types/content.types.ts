import { TrackFull } from "@/shared/server/track/track.select";
import { ArtistBase } from "./artist.types";
import { ContentType, ImageSizes } from "./common.types";
import { playerTrackProps } from "./track.types";
//Repo

export interface AlbumBase {
  id: string;
  name: string;
  cover: ImageSizes;
}

export interface AlbumContentRepository extends AlbumBase {
  artists: ArtistBase[];
}

export interface TrackAlbumRelation {
  album: AlbumBase;
  order: number;
  disk: number;
}

export interface TrackContentRepository {
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
  _count: {
    likes: number;
  };
}

export interface PlaylistContentRepository {
  id: string;
  name: string;
  cover?: ImageSizes;
  tracks?: { track: TrackFull }[];
}

export interface BaseMediaCard {
  id: string;
  title: string;
  href: string;
  image?: ImageSizes | null;
  images?: ImageSizes[] | null;
  tracks?: playerTrackProps[] | null;
}

export type MediaCard = TrackCard | AlbumCard | ArtistCard | PlaylistCard;

export interface TrackCard extends BaseMediaCard {
  type: "tracks";
  artists: { id: string; name: string; avatar: ImageSizes | null }[];
  song: string | null;
  duration: number;
  lyrics: string | null;
  reproductions: number;
  likes: number;
  name: string;
}

export interface AlbumCard extends BaseMediaCard {
  type: "albums";
  artists: { id: string; name: string; avatar: ImageSizes | null }[];
  releaseDate?: string;
}

export interface ArtistCard extends BaseMediaCard {
  type: "artists";
}

export interface PlaylistCard extends BaseMediaCard {
  type: "playlists";
  user: { username: string; name: string; avatar: string | null };
}

export interface CarouselContentProps {
  remove?: {
    artistId?: string;
    albumId?: string;
    trackId?: string;
    playlistId?: string;
  };
  options?: {
    limit?: number;
    isRecomendation?: boolean;
    type?: ContentType[];
  };
  searchBy?: {
    type: "album" | "track" | "artist" | "playlist" | "username";
    id: string;
  };
  forCurrentUser?: boolean;
}

export interface CarouselComponentProps extends CarouselContentProps {
  title?: string;
}
