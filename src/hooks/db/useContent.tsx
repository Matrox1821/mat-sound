import { getContent } from "@/queryFn/client";
import { ContentType } from "@/types";
import { APIContent } from "@/types/apiTypes";
import { CarousellContentProps } from "@/types/components";

export default async function useContent({
  remove,
  options,
  filter,
}: {
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
  filter?: { type: ContentType; id: string };
}): Promise<{ data: CarousellContentProps[] }> {
  let dataToRemove = remove?.artistId || remove?.albumId || remove?.trackId || "";

  const content = await getContent({
    type: options?.type || ["tracks"],
    limit: options?.limit || 8,
    remove: dataToRemove,
    filter,
  });

  const mappedContent =
    content && content.data
      ? content.data.map((data: APIContent) => {
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
        })
      : [];

  return { data: mappedContent };
}
