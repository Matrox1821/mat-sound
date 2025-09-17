import { ContentType } from ".";

export interface CarousellContentProps {
  id: string;
  name: string;
  image: string | string[];
  type: ContentType;
  song: string | null;
  artists: { artist: { name: string; avatar: string; id: string } }[] | null;
  likes: number | null;
  album:
    | {
        album: {
          name: string;
          id: string;
          image: string;
        };
      }[]
    | null;
  duration: number | null;
  orderInAlbum: number | null;
  reproductions: number | null;
  releaseDate: string | null;
  artist: { name: string; id: string; avatar: string } | null;
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
