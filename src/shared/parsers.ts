import { albumPageProps, artistPageProps, trackPageProps } from "@/types";
import { APIAlbum, APIArtist, APIContent, APITrack } from "@/types/apiTypes";
import { CarousellContentProps } from "@/types/components";

export function parseTrack(data: APITrack | null): trackPageProps | null {
  if (!data) return null;

  const { release_date, ...restData } = data;
  return { ...restData, releaseDate: release_date };
}

export function parseAlbum(data: APIAlbum | null): albumPageProps | null {
  return data
    ? {
        id: data.id,
        image: data.image,
        name: data.name,
        releaseDate: data.release_date,
        copyright: data.copyright,
        duration: data.duration,
        tracksCount: data.tracks?.length || 0,
        tracks:
          data.tracks?.map((track) => ({
            track: track.track,
            orderInAlbum: track.order_in_album,
          })) || null,
        artist: data.artist || null,
      }
    : null;
}

export function parseContent(data: APIContent): CarousellContentProps {
  return {
    id: data.id,
    name: data.name,
    image: data.image,
    type: data.type,
    song: data.song || null,
    artists: data.artists || null,
    likes: data._count?.likes || null,
    album: data.albums || null,
    duration: data.duration || null,
    orderInAlbum: data.order_in_album || null,
    reproductions: data.reproductions || null,
    releaseDate: data.release_date || null,
    artist: data.artist || null,
  };
}

export function parseArtist(artist: APIArtist): artistPageProps {
  return {
    id: artist.id,
    name: artist.name,
    image: artist.image,
    listeners: artist.listeners,
    covers: artist.covers,
    description: artist.description,
    socials: artist.socials,
    pageCover: artist.page_cover,
    isVerified: artist.is_verified,
    regionalListeners: artist.regional_listeners,
    followers: artist.followers_default + artist._count?.followers,
  };
}
