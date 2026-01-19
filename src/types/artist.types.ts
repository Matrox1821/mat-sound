import { ImageSizes } from "./common.types";

export interface ArtistBase {
  id: string;
  name: string;
  avatar: ImageSizes | null;
}
export interface ArtistByPagination {
  listeners?: number;
  id: string;
  name: string;
  avatar?: ImageSizes | null;
  mainCover?: string | null;
  description?: string | null;
  isVerified?: boolean;
  regionalListeners?: { [key: string]: string }[] | null;
  socials?: { [key: string]: string }[] | null;
  covers?: string[];
  followersDefault?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
