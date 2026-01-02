import { artistPageProps, artistTracksProps } from "@/types";
import { APIArtist, APIArtistTrack } from "@/types/apiTypes";

export function parseArtist(data: APIArtist | null): artistPageProps | null {
  if (!data) return null;
  const { main_cover, is_verified, regional_listeners, followers_default, _count, ...restData } =
    data;

  return {
    ...restData,
    mainCover: main_cover,
    isVerified: is_verified,
    regionalListeners: regional_listeners,
    followers: followers_default + _count?.followers,
  };
}

export function parsePopularTracks(data: APIArtistTrack[] | null): artistTracksProps[] | null {
  if (!data) return null;

  const newData = data.map((track) => {
    const { release_date, _count, ...rest } = track;
    return {
      ...rest,
      releaseDate: release_date,
      likes: _count?.likes || 0,
    };
  });
  return newData;
}
