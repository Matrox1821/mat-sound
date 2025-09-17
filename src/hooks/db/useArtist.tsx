import { getArtistById } from "@/queryFn/client";
import { artistPageProps } from "@/types";

export default async function getArtist(id: string) {
  const artist = await getArtistById(id).then((data) => data.data || null);
  const parsedArtist = artist
    ? {
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
      }
    : null;

  return { artist: parsedArtist as artistPageProps | null };
}
