import { ContentType, ImageSizes } from "./common.types";
import { playerTrackProps } from "./trackProps";

export interface CarousellContentProps {
  id: string;
  name: string;
  image: ImageSizes;
  type: ContentType;
  song: string | null;
  artists: { artist: { name: string; avatar: ImageSizes; id: string } }[] | null;
  likes: number | null;
  lyrics: string | null;
  album:
    | {
        album: {
          name: string;
          id: string;
          cover: ImageSizes;
        };
      }[]
    | null;
  duration: number | null;
  orderInAlbum: number | null;
  reproductions: number | null;
  releaseDate: string | null;
  artist: { name: string; id: string; avatar: ImageSizes } | null;
  tracks?: playerTrackProps[];
}

export interface CarouselSwiperProps {
  remove?: {
    artistId?: string;
    albumId?: string;
    trackId?: string;
  };
  options?: {
    limit?: number;
    isRecomendation?: boolean;
    type?: ContentType[];
  };
  filter?: {
    type: ContentType;
    id: string;
  };
}

export interface CarouselProps extends CarouselSwiperProps {
  title?: string;
}
